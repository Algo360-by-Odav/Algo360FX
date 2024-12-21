"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
const verificationCodes = new Map();
const mockSendEmail = async (to, code) => {
    console.log(`[DEV] Verification code for ${to}: ${code}`);
    return Promise.resolve();
};
router.post('/verify/send', (0, express_validator_1.body)('email').isEmail(), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email } = req.body;
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        verificationCodes.set(email, { code, expires });
        await mockSendEmail(email, code);
        return res.json({
            success: true,
            message: 'Verification code sent successfully',
        });
    }
    catch (error) {
        console.error('Error sending verification code:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to send verification code'
        });
    }
});
router.post('/verify/code', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('code').isLength({ min: 6, max: 6 }),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, code } = req.body;
        console.log('Verifying code:', { email, code });
        console.log('Stored codes:', Array.from(verificationCodes.entries()));
        const storedData = verificationCodes.get(email);
        console.log('Stored data for email:', storedData);
        if (!storedData) {
            console.log('No verification code found for email:', email);
            return res.status(400).json({ error: 'No verification code found' });
        }
        if (new Date() > storedData.expires) {
            console.log('Code expired. Current time:', new Date(), 'Expiry:', storedData.expires);
            verificationCodes.delete(email);
            return res.status(400).json({ error: 'Verification code expired' });
        }
        if (storedData.code !== code) {
            console.log('Code mismatch. Received:', code, 'Stored:', storedData.code);
            return res.status(400).json({ error: 'Invalid verification code' });
        }
        return res.json({ success: true, message: 'Code verified successfully' });
    }
    catch (error) {
        console.error('Error verifying code:', error);
        return res.status(500).json({ error: 'Failed to verify code' });
    }
});
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }),
    (0, express_validator_1.body)('firstName').notEmpty(),
    (0, express_validator_1.body)('lastName').notEmpty(),
    (0, express_validator_1.body)('verificationCode').notEmpty(),
], async (req, res) => {
    console.log('Registration request body:', req.body);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log('Registration validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password, firstName, lastName, verificationCode } = req.body;
        const storedData = verificationCodes.get(email);
        console.log('Registration verification check:', {
            email,
            verificationCode,
            storedData,
            allStoredCodes: Array.from(verificationCodes.entries())
        });
        if (!storedData || storedData.code !== verificationCode) {
            console.log('Invalid verification code during registration');
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        }
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ error: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = new User_1.User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });
        try {
            await user.save();
            console.log('User saved successfully:', email);
        }
        catch (saveError) {
            console.error('Error saving user:', {
                error: saveError.message,
                code: saveError.code,
                keyPattern: saveError.keyPattern,
                keyValue: saveError.keyValue
            });
            throw saveError;
        }
        verificationCodes.delete(email);
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, config_1.config.jwtSecret, { expiresIn: '24h' });
        return res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack
        });
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json({ error: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({ error: 'User already exists' });
        }
        return res.status(500).json({ error: 'Failed to register user' });
    }
});
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').exists(),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, config_1.config.jwtSecret, { expiresIn: '24h' });
        return res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Failed to login' });
    }
});
router.get('/profile', async (req, res) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        });
    }
    catch (error) {
        console.error('Profile error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map