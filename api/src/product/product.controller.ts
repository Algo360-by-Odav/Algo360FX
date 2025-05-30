import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ProductService } from './product.service';
// @ts-ignore
import { CreateProductDto } from './dto/create-product.dto';
// @ts-ignore
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductType } from './dto/product-enums';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'type', enum: ProductType, required: false })
  @ApiResponse({ status: 200, description: 'Returns all products' })
  async findAll(@Query('type') type?: ProductType) {
    return this.productService.findAll(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific product' })
  @ApiResponse({ status: 200, description: 'Returns the product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Remove a product' })
  @ApiResponse({ status: 200, description: 'Product removed successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get products by type' })
  @ApiResponse({ status: 200, description: 'Returns products of the specified type' })
  async getProductsByType(@Param('type') type: ProductType) {
    return this.productService.getProductsByType(type);
  }

  @Get('featured/list')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({ status: 200, description: 'Returns featured products' })
  async getFeaturedProducts() {
    return this.productService.getFeaturedProducts();
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Returns products matching the search query' })
  async searchProducts(@Param('query') query: string) {
    return this.productService.searchProducts(query);
  }

  // Purchase related endpoints
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/purchase')
  @ApiOperation({ summary: 'Purchase a product' })
  @ApiResponse({ status: 201, description: 'Product purchased successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async purchase(@Param('id') id: string, @Request() req: any) {
    return this.productService.purchase(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('purchases/me')
  @ApiOperation({ summary: 'Get current user purchases' })
  @ApiResponse({ status: 200, description: 'Returns user purchases' })
  async getUserPurchases(@Request() req: any) {
    return this.productService.getUserPurchases(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id/ownership')
  @ApiOperation({ summary: 'Check if user owns a product' })
  @ApiResponse({ status: 200, description: 'Returns ownership information' })
  async checkUserOwnership(@Param('id') id: string, @Request() req: any) {
    return this.productService.checkUserOwnership(id, req.user.id);
  }
}
