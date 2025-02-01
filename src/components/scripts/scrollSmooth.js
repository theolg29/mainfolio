import Lenis from 'lenis'
const lenis = new Lenis() 
lenis.on('scroll', (e) => { 
console.log(e) 
}) 
 
// Ajustez cette valeur pour contrôler la vitesse du défilement 
const scrollSpeed = 1; // Plus la valeur est grande, plus le défilement sera rapide 
 
function raf(time) { 
lenis.raf(time * scrollSpeed) // Multipliez le temps par la vitesse du défilement 
requestAnimationFrame(raf)} 
 
requestAnimationFrame(raf) 