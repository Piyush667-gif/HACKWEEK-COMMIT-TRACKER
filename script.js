class CommitCounter {
  constructor() {
    this.count = 0
    this.counterValue = document.getElementById("counterValue")
    this.counterStatus = document.getElementById("counterStatus")
    this.incrementBtn = document.getElementById("incrementBtn")
    this.decrementBtn = document.getElementById("decrementBtn")
    this.resetBtn = document.getElementById("resetBtn")

    this.init()
  }

  init() {
    // Add event listeners
    this.incrementBtn.addEventListener("click", () => this.increment())
    this.decrementBtn.addEventListener("click", () => this.decrement())
    this.resetBtn.addEventListener("click", () => this.reset())

    // Add keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyboard(e))

    // Initialize display
    this.updateDisplay()
  }

  increment() {
    this.count++
    this.updateDisplay()
    this.showStatus("New commit added! 🚀", "success")
    this.addPulseEffect()
    this.playSound("increment")
  }

  decrement() {
    if (this.count > 0) {
      this.count--
      this.updateDisplay()
      this.showStatus("Commit reverted 📝", "warning")
      this.addPulseEffect()
      this.playSound("decrement")
    } else {
      this.showStatus("Cannot go below 0! 🚫", "error")
      this.shakeCounter()
    }
  }

  reset() {
    const previousCount = this.count
    this.count = 0
    this.updateDisplay()
    this.showStatus(`Day reset! Previous: ${previousCount} commits 🔄`, "info")
    this.addPulseEffect()
    this.playSound("reset")
  }

  updateDisplay() {
    this.counterValue.textContent = this.count

    // Update button states
    this.decrementBtn.disabled = this.count === 0
    this.decrementBtn.style.opacity = this.count === 0 ? "0.5" : "1"

    // Update milestone messages
    this.checkMilestones()
  }

  checkMilestones() {
    const milestones = {
      0: "Ready to track commits! 🎯",
      1: "First commit of the day! 🌟",
      5: "Great momentum! 🔥",
      10: "Double digits! 💪",
      25: "Quarter century! 🎉",
      50: "Half century! 🏆",
      100: "Century! Legendary! 👑",
    }

    if (milestones[this.count]) {
      this.showStatus(milestones[this.count], "milestone")
    }
  }

  showStatus(message, type = "default") {
    this.counterStatus.textContent = message
    this.counterStatus.className = `counter-status ${type}`

    // Auto-clear status after 3 seconds
    setTimeout(() => {
      if (this.count === 0) {
        this.counterStatus.textContent = "Ready to track commits! 🎯"
      } else {
        this.counterStatus.textContent = `${this.count} commit${this.count !== 1 ? "s" : ""} and counting...`
      }
      this.counterStatus.className = "counter-status"
    }, 3000)
  }

  addPulseEffect() {
    this.counterValue.classList.add("pulse")
    setTimeout(() => {
      this.counterValue.classList.remove("pulse")
    }, 600)
  }

  shakeCounter() {
    this.counterValue.style.animation = "shake 0.5s ease-in-out"
    setTimeout(() => {
      this.counterValue.style.animation = ""
    }, 500)
  }

  handleKeyboard(e) {
    switch (e.key) {
      case "+":
      case "=":
        e.preventDefault()
        this.increment()
        break
      case "-":
        e.preventDefault()
        this.decrement()
        break
      case "r":
      case "R":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          this.reset()
        }
        break
    }
  }

  playSound(type) {
    // Create audio context for sound effects
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (AudioContext) {
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different frequencies for different actions
      const frequencies = {
        increment: 800,
        decrement: 400,
        reset: 600,
      }

      oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }
  }
}

// Add shake animation to CSS dynamically
const style = document.createElement("style")
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .counter-status.success { color: #00ff88; }
    .counter-status.warning { color: #ffa500; }
    .counter-status.error { color: #ff6464; }
    .counter-status.info { color: #00d4ff; }
    .counter-status.milestone { 
        color: #ff00ff; 
        font-weight: bold;
        text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
    }
`
document.head.appendChild(style)

// Initialize the counter when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CommitCounter()
})

// Add some extra interactive features
document.addEventListener("DOMContentLoaded", () => {
  // Add click effect to buttons
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })

  // Add ripple animation
  const rippleStyle = document.createElement("style")
  rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `
  document.head.appendChild(rippleStyle)
})
