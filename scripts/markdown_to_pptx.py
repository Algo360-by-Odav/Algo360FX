import os
import re
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import markdown
from bs4 import BeautifulSoup

class PresentationBuilder:
    def __init__(self):
        self.prs = Presentation()
        self.title_slide_layout = self.prs.slide_layouts[0]  # Title slide
        self.content_slide_layout = self.prs.slide_layouts[1]  # Content slide
        self.image_slide_layout = self.prs.slide_layouts[5]  # Image slide
        self.current_slide = None

    def create_title_slide(self, title, subtitle=""):
        slide = self.prs.slides.add_slide(self.title_slide_layout)
        title_shape = slide.shapes.title
        subtitle_shape = slide.placeholders[1]

        title_shape.text = title
        subtitle_shape.text = subtitle

        # Style the title
        title_shape.text_frame.paragraphs[0].font.size = Pt(44)
        title_shape.text_frame.paragraphs[0].font.bold = True
        title_shape.text_frame.paragraphs[0].font.color.rgb = RGBColor(0, 32, 96)

    def create_section_slide(self, title):
        slide = self.prs.slides.add_slide(self.content_slide_layout)
        title_shape = slide.shapes.title
        title_shape.text = title

        # Style the section title
        title_shape.text_frame.paragraphs[0].font.size = Pt(40)
        title_shape.text_frame.paragraphs[0].font.bold = True
        title_shape.text_frame.paragraphs[0].font.color.rgb = RGBColor(0, 32, 96)

        return slide

    def create_content_slide(self, title, content):
        slide = self.prs.slides.add_slide(self.content_slide_layout)
        title_shape = slide.shapes.title
        content_shape = slide.placeholders[1]

        title_shape.text = title
        
        # Style the title
        title_shape.text_frame.paragraphs[0].font.size = Pt(32)
        title_shape.text_frame.paragraphs[0].font.bold = True
        title_shape.text_frame.paragraphs[0].font.color.rgb = RGBColor(0, 32, 96)

        # Add content
        text_frame = content_shape.text_frame
        for line in content:
            p = text_frame.add_paragraph()
            p.text = line
            p.font.size = Pt(18)
            if line.startswith('•'):
                p.level = 1

        return slide

    def create_image_slide(self, title, image_path, caption=""):
        slide = self.prs.slides.add_slide(self.image_slide_layout)
        title_shape = slide.shapes.title
        title_shape.text = title

        # Style the title
        title_shape.text_frame.paragraphs[0].font.size = Pt(32)
        title_shape.text_frame.paragraphs[0].font.bold = True
        title_shape.text_frame.paragraphs[0].font.color.rgb = RGBColor(0, 32, 96)

        # Add image if it exists
        if os.path.exists(image_path):
            left = Inches(2)
            top = Inches(2)
            width = Inches(6)
            slide.shapes.add_picture(image_path, left, top, width=width)

            if caption:
                left = Inches(2)
                top = Inches(6)
                width = Inches(6)
                height = Inches(1)
                txBox = slide.shapes.add_textbox(left, top, width, height)
                tf = txBox.text_frame
                p = tf.add_paragraph()
                p.text = caption
                p.alignment = PP_ALIGN.CENTER
                p.font.size = Pt(14)
                p.font.italic = True

        return slide

def convert_markdown_to_pptx(markdown_file, output_file):
    # Read markdown content
    with open(markdown_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split content into slides
    slides = content.split('---')

    # Initialize presentation builder
    builder = PresentationBuilder()

    for slide in slides:
        if not slide.strip():
            continue

        # Parse the slide content
        lines = slide.strip().split('\n')
        title = ""
        content = []
        image_path = None
        
        for line in lines:
            if line.startswith('# '):
                title = line[2:].strip()
            elif line.startswith('## '):
                if not title:
                    title = line[3:].strip()
                else:
                    content.append(line[3:].strip())
            elif line.startswith('!['):
                # Extract image path from markdown image syntax
                match = re.search(r'\!\[(.*?)\]\((.*?)\)', line)
                if match:
                    image_path = match.group(2)
                    image_path = os.path.join(os.path.dirname(markdown_file), '..', image_path)
            elif line.strip():
                content.append(line.strip())

        # Create appropriate slide type
        if title and not content and not image_path:
            builder.create_section_slide(title)
        elif image_path:
            builder.create_image_slide(title, image_path)
        elif title and content:
            builder.create_content_slide(title, content)
        elif title:
            builder.create_title_slide(title)

    # Save the presentation
    builder.prs.save(output_file)

if __name__ == "__main__":
    # Set up paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    markdown_file = os.path.join(base_dir, 'docs', 'investor_deck.md')
    output_file = os.path.join(base_dir, 'presentation', 'Algo360FX_Investor_Presentation.pptx')
    
    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    # Convert markdown to PowerPoint
    convert_markdown_to_pptx(markdown_file, output_file)
    print(f"Presentation created successfully: {output_file}")
