document.addEventListener('DOMContentLoaded', function() {
  // Initialize the app
  showScreen('welcome-screen');
  
  // Set up navigation between screens
  document.querySelectorAll('[data-next]').forEach(button => {
    button.addEventListener('click', function() {
      const nextScreen = this.getAttribute('data-next');
      showScreen(nextScreen);
    });
  });
  
  // Emotion cards selection
  document.querySelectorAll('.emotion-card').forEach(card => {
    card.addEventListener('click', function() {
      document.querySelectorAll('.emotion-card').forEach(c => {
        c.style.border = 'none';
      });
      this.style.border = '2px solid var(--primary-color)';
    });
  });
  
  // Handle chat input
  const chatForm = document.getElementById('chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = document.getElementById('chat-input');
      if (input.value.trim()) {
        addChatMessage(input.value, 'user');
        input.value = '';
        
        // Simulate AI response after a short delay
        setTimeout(() => {
          // Predefined responses based on the current screen
          const currentScreen = document.querySelector('.screen.active').id;
          
          let response;
          if (currentScreen === 'story-guide-screen') {
            response = "太棒了！这展现了孩子的独立性和学习能力。能告诉我更多关于孩子平时的兴趣爱好吗？";
          } else if (currentScreen === 'ongoing-conversation-screen') {
            response = "这个科学实验很有创意！看来孩子对科学探索有浓厚的兴趣，这是STEM领域发展的良好基础。";
          } else {
            response = "谢谢分享！我注意到了孩子的这个闪光点。";
          }
          
          addChatMessage(response, 'ai');
          
          // If this is the story guide screen, offer to proceed after response
          if (currentScreen === 'story-guide-screen') {
            setTimeout(() => {
              const chatContainer = document.querySelector('.chat-container');
              const proceedDiv = document.createElement('div');
              proceedDiv.className = 'action-bar';
              proceedDiv.innerHTML = '<button class="btn" data-next="insight-summary-screen">查看发现</button>';
              chatContainer.appendChild(proceedDiv);
              
              // Add event listener to the new button
              proceedDiv.querySelector('button').addEventListener('click', function() {
                showScreen(this.getAttribute('data-next'));
              });
            }, 1000);
          }
        }, 1000);
      }
    });
  }
  
  // Initialize any charts or visualizations
  initVisualizations();
});

// Function to show a specific screen
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show the requested screen
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add('active');
    
    // Update progress indicator if it exists
    updateProgress(screenId);
    
    // Special handling for specific screens
    if (screenId === 'story-guide-screen') {
      // If this is the first time showing this screen, add initial AI message
      if (!screen.querySelector('.chat-bubble')) {
        addChatMessage("能跟我分享一个最近孩子让您印象深刻的时刻吗？", 'ai');
      }
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }
}

// Function to add a chat message
function addChatMessage(message, sender) {
  const chatContainer = document.querySelector('.chat-container');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-bubble ${sender}`;
  messageDiv.textContent = message;
  chatContainer.appendChild(messageDiv);
  
  // Scroll to the bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Update progress indicator
function updateProgress(currentScreenId) {
  const progressIndicator = document.querySelector('.progress-indicator');
  if (!progressIndicator) return;
  
  const screens = [
    'welcome-screen',
    'emotion-cards-screen',
    'story-guide-screen',
    'insight-summary-screen',
    'growth-portrait-screen'
  ];
  
  const currentIndex = screens.indexOf(currentScreenId);
  if (currentIndex >= 0) {
    const dots = progressIndicator.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
      if (index <= currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

// Initialize visualizations
function initVisualizations() {
  // For a real app, we would use a charting library like Chart.js
  // For this demo, we'll simulate the radar chart with HTML/CSS
  const radarChart = document.querySelector('.radar-chart');
  if (radarChart) {
    const traits = [
      { name: '创造力', value: 0.9 },
      { name: '独立性', value: 0.8 },
      { name: '好奇心', value: 0.95 },
      { name: '韧性', value: 0.7 },
      { name: '合作能力', value: 0.65 }
    ];
    
    traits.forEach((trait, index) => {
      const angle = (Math.PI * 2 * index) / traits.length - Math.PI / 2;
      const distance = trait.value * 100;
      const x = 125 + Math.cos(angle) * distance;
      const y = 125 + Math.sin(angle) * distance;
      
      const point = document.createElement('div');
      point.style.position = 'absolute';
      point.style.left = `${x}px`;
      point.style.top = `${y}px`;
      point.style.width = '8px';
      point.style.height = '8px';
      point.style.borderRadius = '50%';
      point.style.backgroundColor = 'var(--secondary-color)';
      
      const label = document.createElement('div');
      label.style.position = 'absolute';
      label.style.left = `${125 + Math.cos(angle) * 120}px`;
      label.style.top = `${125 + Math.sin(angle) * 120}px`;
      label.style.transform = 'translate(-50%, -50%)';
      label.style.fontSize = '12px';
      label.style.color = 'var(--primary-color)';
      label.textContent = trait.name;
      
      radarChart.appendChild(point);
      radarChart.appendChild(label);
      
      // Draw lines connecting points
      if (index > 0) {
        const prevAngle = (Math.PI * 2 * (index - 1)) / traits.length - Math.PI / 2;
        const prevDistance = traits[index - 1].value * 100;
        const prevX = 125 + Math.cos(prevAngle) * prevDistance;
        const prevY = 125 + Math.sin(prevAngle) * prevDistance;
        
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.width = '2px';
        line.style.height = `${Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2))}px`;
        line.style.backgroundColor = 'var(--secondary-color)';
        line.style.opacity = '0.6';
        
        const rotation = Math.atan2(y - prevY, x - prevX) * 180 / Math.PI;
        line.style.transform = `translate(${prevX}px, ${prevY}px) rotate(${rotation}deg)`;
        line.style.transformOrigin = '0 0';
        
        radarChart.appendChild(line);
      }
      
      // Connect last and first point
      if (index === traits.length - 1) {
        const firstAngle = (Math.PI * 2 * 0) / traits.length - Math.PI / 2;
        const firstDistance = traits[0].value * 100;
        const firstX = 125 + Math.cos(firstAngle) * firstDistance;
        const firstY = 125 + Math.sin(firstAngle) * firstDistance;
        
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.width = '2px';
        line.style.height = `${Math.sqrt(Math.pow(firstX - x, 2) + Math.pow(firstY - y, 2))}px`;
        line.style.backgroundColor = 'var(--secondary-color)';
        line.style.opacity = '0.6';
        
        const rotation = Math.atan2(firstY - y, firstX - x) * 180 / Math.PI;
        line.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        line.style.transformOrigin = '0 0';
        
        radarChart.appendChild(line);
      }
    });
  }
  
  // Set strength levels for insight cards
  document.querySelectorAll('.strength-level').forEach(level => {
    const percentage = level.getAttribute('data-level') || Math.random() * 0.5 + 0.5;
    level.style.width = `${percentage * 100}%`;
  });
} 