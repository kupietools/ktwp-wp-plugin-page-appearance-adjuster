# KupieTools Page Appearance Adjuster

A powerful WordPress plugin that adds a floating control panel to your website, allowing visitors to customize their viewing experience with adjustments for brightness, contrast, color temperature, and more.

## Features

- Floating, accessible control panel with intuitive icon
- Adjustable brightness (50% to 150%)
- Adjustable contrast (50% to 150%) 
- Color temperature control for warmer or cooler display
- Hue rotation for complete color transformation
- Built-in dark mode toggle
- Font size adjustment
- Saturation control
- Fun "earthquake" effect with variable intensity
- Settings persistence through localStorage
- Reset button to restore default settings
- Mobile-friendly interface
- Elegant animations and transitions
- No configuration needed - works instantly

## How It Works

The plugin adds a small gear icon to the corner of your website that expands into a full control panel when clicked. Visitors can adjust various visual aspects of your site using simple sliders, with changes applied in real-time using CSS filters. All settings are automatically saved to the visitor's browser for persistence between visits.

## Technical Implementation

- Uses CSS filters for visual adjustments without modifying page content
- JavaScript-based control panel with jQuery integration
- Custom animation effects for interface elements
- Automatic settings persistence using localStorage
- Clean, modern control panel UI
- Self-contained with no external dependencies
- Carefully crafted to avoid conflicts with other plugins
- Special handling for images in dark mode
- Performance optimized with minimal impact on page loading

## Advanced Features

### Dark Mode
The dark mode toggle inverts your site's colors while maintaining readability, perfect for night browsing or reducing eye strain.

### Color Temperature
The temperature slider adjusts the warmth/coolness of your site's colors, simulating different color temperatures from warm amber to cool blue.

### Font Size Control
Visitors can increase or decrease the font size across your entire site for improved readability.

### Earthquake Effect
A fun feature that adds a subtle (or not-so-subtle) shaking effect to the page elements, useful for demonstrations or just for fun.

## Installation

1. Upload the plugin files to the `/wp-content/plugins/ktwp-page-appearance-adjuster` directory
2. Activate the plugin through the WordPress admin interface
3. No configuration needed - the control panel will appear automatically

## Use Cases

- Improve accessibility for visitors with visual impairments
- Allow night mode reading with reduced eye strain
- Provide a personalized browsing experience
- Demonstrate responsive design capabilities
- Help users with color vision deficiencies adjust contrast
- Offer font size control for improved readability
- Add a fun interactive element to your website

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
