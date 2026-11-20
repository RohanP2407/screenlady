import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_board_collab():
    canvas_w = 2500
    canvas_h = 1420
    
    # 1. Create Base Background with deep luxury dark obsidian gradient
    base = Image.new('RGB', (canvas_w, canvas_h), '#08080C')
    draw = ImageDraw.Draw(base)
    
    # Subtle central radial glow
    for r in range(700, 0, -20):
        alpha = int((1.0 - (r / 700.0)) * 24)
        glow_box = [
            canvas_w // 2 - r * 1.6,
            canvas_h // 2 - r - 80,
            canvas_w // 2 + r * 1.6,
            canvas_h // 2 + r - 80
        ]
        draw.ellipse(glow_box, fill=(212, 175, 55, alpha) if alpha > 0 else None)
    
    # Outer luxury gold double border
    margin_outer = 28
    margin_inner = 38
    draw.rectangle(
        [(margin_outer, margin_outer), (canvas_w - margin_outer, canvas_h - margin_outer)],
        outline='#D4AF37', width=3
    )
    draw.rectangle(
        [(margin_inner, margin_inner), (canvas_w - margin_inner, canvas_h - margin_inner)],
        outline='#4A3E1E', width=1
    )
    
    # Corner gold flourishes / diamonds
    corner_size = 14
    for cx, cy in [
        (margin_inner, margin_inner),
        (canvas_w - margin_inner, margin_inner),
        (margin_inner, canvas_h - margin_inner),
        (canvas_w - margin_inner, canvas_h - margin_inner)
    ]:
        draw.polygon([
            (cx, cy - corner_size),
            (cx + corner_size, cy),
            (cx, cy + corner_size),
            (cx - corner_size, cy)
        ], fill='#D4AF37')
    
    # 2. Header: Logo Emblem & Royal Titles
    logo_path = 'assets/images/logo-2.png'
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert('RGBA')
        logo.thumbnail((120, 120), Image.Resampling.LANCZOS)
        logo_x = (canvas_w - logo.width) // 2
        logo_y = 52
        base.paste(logo, (logo_x, logo_y), logo)
    
    # Fonts
    font_serif_bold = 'C:/Windows/Fonts/georgiab.ttf' if os.path.exists('C:/Windows/Fonts/georgiab.ttf') else 'georgia.ttf'
    font_serif_reg = 'C:/Windows/Fonts/georgia.ttf' if os.path.exists('C:/Windows/Fonts/georgia.ttf') else 'georgia.ttf'
    font_sans_bold = 'C:/Windows/Fonts/calibrib.ttf' if os.path.exists('C:/Windows/Fonts/calibrib.ttf') else 'calibri.ttf'
    font_sans_reg = 'C:/Windows/Fonts/calibri.ttf' if os.path.exists('C:/Windows/Fonts/calibri.ttf') else 'calibri.ttf'
    
    font_title = ImageFont.truetype(font_serif_bold, 50)
    font_subtitle = ImageFont.truetype(font_sans_bold, 24)
    font_kicker = ImageFont.truetype(font_sans_bold, 18)
    font_name = ImageFont.truetype(font_serif_bold, 24)
    font_role = ImageFont.truetype(font_sans_bold, 18)
    font_footer = ImageFont.truetype(font_serif_reg, 19)
    font_footer_sub = ImageFont.truetype(font_sans_reg, 16)
    
    # Main Header Text
    title_text = "ACCOLADE SCREENLADY"
    t_box = draw.textbbox((0, 0), title_text, font=font_title)
    t_w = t_box[2] - t_box[0]
    draw.text(((canvas_w - t_w) // 2, 175), title_text, fill='#E5C158', font=font_title)
    
    sub_text = "EXECUTIVE LEADERSHIP & EDITORIAL BOARD"
    s_box = draw.textbbox((0, 0), sub_text, font=font_subtitle)
    s_w = s_box[2] - s_box[0]
    draw.text(((canvas_w - s_w) // 2, 238), sub_text, fill='#EDE8DE', font=font_subtitle)
    
    # Gold decorative divider line
    div_y = 282
    draw.line([(canvas_w // 2 - 420, div_y), (canvas_w // 2 - 40, div_y)], fill='#D4AF37', width=1)
    draw.line([(canvas_w // 2 + 40, div_y), (canvas_w // 2 + 420, div_y)], fill='#D4AF37', width=1)
    draw.polygon([
        (canvas_w // 2, div_y - 6),
        (canvas_w // 2 + 10, div_y),
        (canvas_w // 2, div_y + 6),
        (canvas_w // 2 - 10, div_y)
    ], fill='#D4AF37')
    
    # 3. Members Configuration
    members = [
        {
            'name': 'Mrs. Sakshi Sagvekar',
            'role': 'MANAGING DIRECTOR',
            'file': 'assets/images/board/sakshi-sagvekar.jpg',
            'crop': (0, 45, 420, 565),
            'highlight': False
        },
        {
            'name': 'Mrs. Amruta Rao',
            'role': 'EDITOR-IN-CHIEF',
            'file': 'assets/images/board/amruta-rao.jpg',
            'crop': (140, 50, 820, 880),
            'highlight': False
        },
        {
            'name': 'Mr. Prashant Sagvekar',
            'role': 'FOUNDER & PUBLISHER',
            'file': 'assets/images/board/prashant-sagvekar.jpg',
            'crop': (0, 30, 682, 850),
            'highlight': True
        },
        {
            'name': 'Mrs. Supriya Vinod',
            'role': 'BOARD MEMBER',
            'file': 'assets/images/board/supriya-vinod.jpg',
            'crop': (0, 50, 682, 860),
            'highlight': False
        },
        {
            'name': 'Mr. Vedang Sagvekar',
            'role': 'MARKETING DIRECTOR',
            'file': 'assets/images/board/vedang-sagvekar.jpg',
            'crop': (0, 120, 576, 850),
            'highlight': False
        }
    ]
    
    port_w = 420
    port_h = 570
    start_y = 320
    
    total_ports_w = len(members) * port_w
    available_spacing = canvas_w - total_ports_w
    gap = available_spacing // (len(members) + 1)
    
    for i, m in enumerate(members):
        col_x = gap + i * (port_w + gap)
        
        # Load and crop member photo
        if os.path.exists(m['file']):
            with Image.open(m['file']) as src:
                src_rgb = src.convert('RGB')
                cropped = src_rgb.crop(m['crop'])
                resized = cropped.resize((port_w, port_h), Image.Resampling.LANCZOS)
                
                # Paste photo
                base.paste(resized, (col_x, start_y))
                
                # Portrait Frame (Gold Border)
                border_color = '#F5D77F' if m['highlight'] else '#D4AF37'
                border_w = 3 if m['highlight'] else 2
                draw.rectangle(
                    [(col_x - 1, start_y - 1), (col_x + port_w, start_y + port_h)],
                    outline=border_color, width=border_w
                )
                
                # If Founder, add a subtle golden highlight badge above
                if m['highlight']:
                    founder_badge_text = "✦ FOUNDING VISIONARY ✦"
                    fb_box = draw.textbbox((0, 0), founder_badge_text, font=font_kicker)
                    fb_w = fb_box[2] - fb_box[0]
                    fb_x = col_x + (port_w - fb_w) // 2
                    fb_y = start_y - 28
                    draw.rectangle(
                        [(fb_x - 10, fb_y - 3), (fb_x + fb_w + 10, fb_y + 22)],
                        fill='#1E170A', outline='#D4AF37', width=1
                    )
                    draw.text((fb_x, fb_y), founder_badge_text, fill='#E5C158', font=font_kicker)
        
        # Nameplate Box below portrait
        plaque_h = 100
        plaque_y = start_y + port_h + 16
        
        # Plaque background
        draw.rectangle(
            [(col_x, plaque_y), (col_x + port_w, plaque_y + plaque_h)],
            fill='#111118', outline='#3D3622', width=1
        )
        # Gold accent top line on plaque
        draw.line(
            [(col_x, plaque_y), (col_x + port_w, plaque_y)],
            fill='#D4AF37' if not m['highlight'] else '#F5D77F',
            width=2 if not m['highlight'] else 3
        )
        
        # Member Name
        name_box = draw.textbbox((0, 0), m['name'], font=font_name)
        n_w = name_box[2] - name_box[0]
        draw.text(
            (col_x + (port_w - n_w) // 2, plaque_y + 18),
            m['name'], fill='#FFFFFF', font=font_name
        )
        
        # Member Role / Designation
        role_box = draw.textbbox((0, 0), m['role'], font=font_role)
        r_w = role_box[2] - role_box[0]
        draw.text(
            (col_x + (port_w - r_w) // 2, plaque_y + 56),
            m['role'], fill='#D4AF37', font=font_role
        )
    
    # 4. Footer Section
    foot_div_y = 1290
    draw.line([(margin_inner + 40, foot_div_y), (canvas_w - margin_inner - 40, foot_div_y)], fill='#3D3622', width=1)
    draw.line([(canvas_w // 2 - 300, foot_div_y), (canvas_w // 2 + 300, foot_div_y)], fill='#D4AF37', width=1)
    
    foot_text1 = "A Premier Women-Centric National Publication Celebrating Resilience, Struggles and Success Stories"
    f1_box = draw.textbbox((0, 0), foot_text1, font=font_footer)
    f1_w = f1_box[2] - f1_box[0]
    draw.text(((canvas_w - f1_w) // 2, 1315), foot_text1, fill='#EDE8DE', font=font_footer)
    
    foot_text2 = "Raigad, Maharashtra • PRGI Reg. No. MHMAR/26/A3113 • Editor: Prashant Chandrakant Sagvekar"
    f2_box = draw.textbbox((0, 0), foot_text2, font=font_footer_sub)
    f2_w = f2_box[2] - f2_box[0]
    draw.text(((canvas_w - f2_w) // 2, 1350), foot_text2, fill='#9CA3AF', font=font_footer_sub)
    
    out_path = 'assets/images/board/screenlady-board-collab.jpg'
    base.save(out_path, quality=95)
    print(f"Collab image successfully generated: {out_path} ({canvas_w}x{canvas_h})")

if __name__ == '__main__':
    create_board_collab()

