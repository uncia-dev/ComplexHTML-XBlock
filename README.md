### cdot_slides_for_edx XBlock

Created by Raymond Blaga for the edX Aviation Project at Seneca College's Centre for Development of Open Technology.

This XBlock is a component for the edX platform and can be installed on devstakcblac and fullstack. It permits a course author to write made HTML, CSS, JavaScript and JSON code in the Studio view, all of which is compiled into a slide for student viewing. Unlike edX's built-in HTML module, this XBlock can also record student interactions within the slide, for later analysis.

This module is meant to be used in conjunction with CDOT's JavaScript library for a customized edX course, however it is available for others, should they have interest in it.




# Installation
====

There is also support for CKEditor; edit

"cdot_slides_for_edx/cdot_slides_for_edx/static/js/cdot_slides_for_edx_studio.js" and search for "CKEditor_URL". Set the value 



To install this module, SSH into your edX server and enter the following commands:

  git clone https://github.com/uw-ray/cdot_slides_for_edx.git
  sudo -u edxapp /edx/bin/pip.edxapp install cdot_slides_for_edx/
