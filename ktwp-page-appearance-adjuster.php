<?php
/*
Plugin Name: Kupietools Page Appearance Adjuster
Description: Adds a control panel to adjust page brightness, contrast, and color temperature
Version: 1.0
Author: Michael Kupietz
*/

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Add the control panel HTML and required scripts/styles
function page_adjuster_enqueue_assets() {
    wp_enqueue_style('page-adjuster-styles', plugins_url('css/style.css', __FILE__));
    wp_enqueue_script('page-adjuster-script', plugins_url('js/script.js', __FILE__), array('jquery'), '1.0', array(
		'in_footer' => true,
		'strategy'  => 'defer'
	)
);
}
add_action('wp_enqueue_scripts', 'page_adjuster_enqueue_assets');

// Add the control panel HTML to the footer
function page_adjuster_add_control_panel() {
    ?>
    <div id="page-adjuster-control" class="page-adjuster-control">
       <div class="page-adjuster-icon">
<?php /* OTHER LOGO  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#000000" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><g><path d="M15.367,8.547c-3.768,0-6.822,3.059-6.822,6.818c0,3.768,3.055,6.824,6.822,6.824s6.816-3.057,6.816-6.824C22.184,11.605,19.135,8.547,15.367,8.547z M15.587,21.076c0-1.262,0-8.49,0-11.414c3.154,0,5.705,2.559,5.705,5.703C21.292,18.518,18.74,21.076,15.587,21.076z"/><path d="M14.122,6.6V1.244C14.122,0.555,14.677,0,15.363,0l0,0c0.691,0,1.247,0.555,1.247,1.244l0,0V6.6c0,0.688-0.556,1.242-1.247,1.242l0,0C14.677,7.842,14.122,7.287,14.122,6.6L14.122,6.6z"/><path d="M14.122,29.488v-5.35c0-0.689,0.556-1.246,1.242-1.246l0,0c0.691,0,1.247,0.557,1.247,1.246l0,0v5.35c0,0.689-0.556,1.248-1.247,1.248l0,0C14.677,30.736,14.122,30.178,14.122,29.488L14.122,29.488z"/><path d="M20.691,10.045c-0.485-0.484-0.485-1.273,0-1.758l0,0l3.784-3.785c0.486-0.484,1.273-0.484,1.761,0l0,0c0.485,0.486,0.485,1.275,0,1.76l0,0l-3.788,3.783c-0.241,0.242-0.56,0.367-0.879,0.367l0,0C21.25,10.412,20.932,10.287,20.691,10.045L20.691,10.045z"/><path d="M4.498,26.234c-0.486-0.484-0.486-1.273,0-1.76l0,0l3.788-3.783c0.487-0.484,1.274-0.484,1.76,0l0,0c0.488,0.48,0.488,1.271,0,1.754l0,0l-3.783,3.789C6.017,26.477,5.7,26.596,5.38,26.596l0,0C5.061,26.596,4.743,26.477,4.498,26.234L4.498,26.234z"/><path d="M24.139,16.613c-0.689,0-1.25-0.559-1.25-1.248l0,0c0-0.684,0.561-1.242,1.25-1.242l0,0h5.35c0.689,0,1.246,0.559,1.246,1.242l0,0c0,0.689-0.557,1.248-1.246,1.248l0,0H24.139L24.139,16.613z"/><path d="M1.244,16.613C0.553,16.613,0,16.055,0,15.365l0,0c0-0.684,0.553-1.242,1.244-1.242l0,0h5.349c0.688,0,1.249,0.559,1.249,1.242l0,0c0,0.689-0.561,1.248-1.249,1.248l0,0L1.244,16.613L1.244,16.613z"/><path d="M24.476,26.234l-3.784-3.789c-0.485-0.482-0.485-1.273,0-1.754l0,0c0.481-0.484,1.274-0.484,1.757,0l0,0l3.788,3.783c0.485,0.486,0.485,1.275,0,1.76l0,0c-0.247,0.242-0.564,0.361-0.883,0.361l0,0C25.031,26.596,24.715,26.477,24.476,26.234L24.476,26.234z"/><path d="M8.285,10.045L4.498,6.262c-0.486-0.484-0.486-1.273,0-1.76l0,0c0.49-0.484,1.279-0.484,1.765,0l0,0l3.783,3.785c0.488,0.484,0.488,1.273,0,1.758l0,0c-0.246,0.242-0.562,0.367-0.882,0.367l0,0C8.846,10.412,8.526,10.287,8.285,10.045L8.285,10.045z"/></g></svg> */ ?><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg> 
    <span class="hover-text">Open Visual Settings</span>
</div>

        <div ID="ktwp-paa-page-adjuster-panel" class="page-adjuster-panel">
            <div class="panel-header">
                <span>Page Appearance</span>
                <button class="page-adjuster-close-button">&times;</button>
            </div>
            <div class="panel-content">
                <div class="control-group">
                    <label for="brightness">Brightness <span class="value">100%</span></label>
                    <input type="range" id="brightness" min="50" max="150" value="100">
                </div>
                <div class="control-group">
                    <label for="contrast">Contrast <span class="value">100%</span></label>
                    <input type="range" id="contrast" min="50" max="150" value="100">
                </div>
                <div class="control-group">
                    <label for="temperature">Color Temperature <span class="value"></span></label>
                    <input type="range" id="temperature" min="-50" max="50" value="0">
                </div>
				<div class="control-group">
					<label for="hue">Hue Rotation <span class="value">0째</span></label>
    <input type="range" id="hue" min="0" max="360" value="0">
    
</div><div class="control-group">
					<label for="saturation">Saturation <span class="value">100%</span></label>
    <input type="range" id="saturation" min="0" max="200" value="0">
    
</div>
				<div class="control-group">
    <label for="fontsize">Font Size <span class="value"></span></label>
    <input type="range" id="fontsize" min="7" max="40" step="1">
   
</div>
				<div class="setting-row">
    <label class="setting-label">
        <input type="checkbox" id="darkmode-toggle">
        Dark Mode
    </label>
</div>
				<div class="control-group">
    <label for="earthquake">Earthquake <span class="value">0.0</span></label>
    <input type="range" id="earthquake" min="0" max="10" step="0.1" value="0">
  
</div>


			
            </div>
			<button id="reset-button" style="width: 100%; padding: 8px; background: #808080; color: white; border: none; border-radius: 3px; cursor: pointer; margin-top: 10px;">Reset to Default</button>
        </div>
    </div>
<script id="ktwp_paa-inline-script">
	['mousedown','dragstart','touchstart','touchmove','click'].forEach(thisAction => {
document.getElementById("ktwp-paa-page-adjuster-panel").addEventListener(thisAction, function(event) { event.stopPropagation();});});


const ktwp_paa_numOfKupieTabs=document.getElementsByClassName("ktwp-kupietabs-tab-div").length; /* start at 0 so no offset from 130px */
const ktwp_paa_thisTab=document.getElementById("page-adjuster-control");

if(ktwp_paa_thisTab) {
	ktwp_paa_thisTab.classList.add("ktwp-kupietabs-tab-div");
	ktwp_paa_thisTab.style.top = (130+ ktwp_paa_numOfKupieTabs * 38) + "px";
	ktwp_paa_thisTab.style.display = "block";
/* end move the new tab to stack under tabs from other KupieTools plugins */}

</script>





<!-- /script was this closing script tag here for a reason? I think it was a mistake. Removed 2025aug26 -->
    <?php
}
add_action('wp_footer', 'page_adjuster_add_control_panel');

/* removed activation hooks to create js and css, obsolete. */