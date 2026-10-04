'use strict';
// The shared consent controlled analytics handles these links. This page never
// turns an open or email click into a successfully stored lead.
document.querySelectorAll('[data-inquiry]').forEach(link=>{link.dataset.bwInquiry=link.dataset.inquiry;});
