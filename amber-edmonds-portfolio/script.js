const filterButtons = document.querySelectorAll('.project-tags .tag')
const cards = document.querySelectorAll('.card')

for (const button of filterButtons) {
    button.addEventListener('click', () => {
        const filter = button.dataset.type

        // update is-active state
        for (const b of filterButtons) {
            b.classList.remove('is-active')
        }
        button.classList.add('is-active')

        for (const card of cards) {
            const types = card.dataset.type
            const shouldShow = filter === 'all' || types.includes(filter)
            
            if (shouldShow) {
                card.style.display = ''
            } else {
                card.style.display = 'none'
            }
        }
    })
}