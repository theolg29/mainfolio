document.querySelectorAll('.flex-col').forEach(item => {
    item.addEventListener('mousemove', event => {
      const tooltip = item.querySelector('.tooltip');
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      tooltip.style.left = `${x + 10}px`;
      tooltip.style.top = `${y + 10}px`;
    });
  });