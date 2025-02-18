import Lenis from 'lenis'
const lenis = new Lenis() 
lenis.on('scroll', (e) => { 
}) 
 
const scrollSpeed = 1;
 
function raf(time) { 
lenis.raf(time * scrollSpeed)
requestAnimationFrame(raf)} 
 
requestAnimationFrame(raf) 