import os
from svgpathtools import svg2paths2, Line, CubicBezier, QuadraticBezier
from svgwrite import Drawing  # For exporting to SVG

# Define canvas dimensions in mm (A4 portrait)
CANVAS_WIDTH = 210  # mm
CANVAS_HEIGHT = 297  # mm

# Folder containing your SVG files
SVG_FOLDER = "./matrixchars"

# Global scale factor for character size
SCALE = 4  # Adjust this for consistent character size

def load_svg_paths(folder):
    """Load SVG files and extract their paths."""
    svg_files = [f for f in os.listdir(folder) if f.endswith(".svg")]
    paths = []
    for svg_file in svg_files:
        file_path = os.path.join(folder, svg_file)
        svg_paths, _, _ = svg2paths2(file_path)
        print(f"{svg_file}: {len(svg_paths)} paths loaded")
        paths.append(svg_paths)
    return paths

def export_to_svg(paths, canvas_width, canvas_height, filename="output.svg"):
    """Export the layout to an SVG file, including an A4 paper outline."""
    dwg = Drawing(filename, size=(f"{canvas_width}mm", f"{canvas_height}mm"))

    # Add an A4 outline rectangle
    dwg.add(dwg.rect(insert=(0, 0),
                     size=(f"{canvas_width}mm", f"{canvas_height}mm"),
                     stroke="black", fill="none", stroke_width=0.5))  # 0.5mm outline

    x_offset, y_offset = 5, 5  # Start position (10 mm margin)

    for svg_paths in paths:
        # Calculate bounding box for spacing
        max_width, max_height = 0, 0
        for svg_path in svg_paths:
            bbox = svg_path.bbox()
            if bbox:
                max_width = max(max_width, bbox[2] - bbox[0])
                max_height = max(max_height, bbox[3] - bbox[1])

        # Adjust spacing based on bounding box and scale
        spacing_x = max_width * SCALE
        spacing_y = max_height * SCALE

        for svg_path in svg_paths:
            # Convert SVG path to svgwrite-compatible path
            path_data = svg_path_to_svgwrite_path(svg_path, SCALE)
            dwg.add(dwg.path(d=path_data, stroke="black", fill="none", transform=f"translate({x_offset},{y_offset})"))

        # Move to the next position
        x_offset += spacing_x

        # Wrap to the next row if the character goes off the canvas
        if x_offset + spacing_x > canvas_width:
            x_offset = 10  # Reset to the left margin
            y_offset += spacing_y

    # Save the SVG file
    dwg.save()
    print(f"SVG exported to {filename}")


def svg_path_to_svgwrite_path(svg_path, transform):
    """Convert an SVG path to an svgwrite-compatible path string."""
    commands = []
    for segment in svg_path:
        if isinstance(segment, Line):
            commands.append(f"M {transform * segment.start.real} {transform * segment.start.imag}")
            commands.append(f"L {transform * segment.end.real} {transform * segment.end.imag}")
        elif isinstance(segment, CubicBezier):
            commands.append(f"M {transform * segment.start.real} {transform * segment.start.imag}")
            commands.append(
                f"C {transform * segment.control1.real} {transform * segment.control1.imag}, "
                f"{transform * segment.control2.real} {transform * segment.control2.imag}, "
                f"{transform * segment.end.real} {transform * segment.end.imag}"
            )
        elif isinstance(segment, QuadraticBezier):
            commands.append(f"M {transform * segment.start.real} {transform * segment.start.imag}")
            commands.append(
                f"Q {transform * segment.control.real} {transform * segment.control.imag}, "
                f"{transform * segment.end.real} {transform * segment.end.imag}"
            )
    return " ".join(commands)

def main():
    # Load SVG paths
    svg_paths = load_svg_paths(SVG_FOLDER)

    # Export layout to SVG
    export_to_svg(svg_paths, CANVAS_WIDTH, CANVAS_HEIGHT, filename="output.svg")

    print("SVG exported! Open it in Inkscape or a browser and refresh to see updates.")

if __name__ == "__main__":
    main()
