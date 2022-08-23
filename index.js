const initialImgWidth = 50 // frame width in rem
const initialImgHeight = 30 // frame height in rem
const amountOfPicturesInSlide = 3 // number of visible pictures in frame
const amountOfSlidesPerSlide = 1 // amount of scrolled pictures per one slide
const speed = 700 // scroll speed in ms
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
const sliderTrack = document.querySelector('.slider-track')
const numberOfInitialDrownSlides = amountOfPicturesInSlide + (amountOfSlidesPerSlide * 2)
const imgWidth = initialImgWidth / amountOfPicturesInSlide
const images = [
    './pictures/1.jpg',
    './pictures/2.jpg',
    './pictures/4.jpg', 
    './pictures/5.jpg', 
    './pictures/6.jpg', 
    './pictures/7.jpg', 
    './pictures/8.jpg', 
    './pictures/9.jpg',
    './pictures/10.jpg',
    './pictures/11.jpg',
    './pictures/12.jpg'
]
const initialCoords = {
    x : 0
}
const currentCoords = {
    x : 0
}
let touchStartTime
let touchEndTime
let mouseRelativePosition = 0
let mouseClickedOnTheElement = false
let marginLeft
let indexNext = images.length - amountOfSlidesPerSlide
let indexPrev = amountOfPicturesInSlide + amountOfSlidesPerSlide
let slideSwitcher = true
sliderTrack.style.width = initialImgWidth + 'rem'

const displayedImages = []

function drawInitialImages() {
    let index = indexNext
    for (let i = 0; i < numberOfInitialDrownSlides; i++) {
        if (index === images.length) index = 0
        const img = drawNewImg(index)
        if (i === 0) img.style.marginLeft = -(imgWidth * amountOfSlidesPerSlide) + 'rem'
        displayedImages.push(img)
        sliderTrack.append(img)
        index++
    }
}

function slideNext() {
    if (slideSwitcher) {
        slideSwitcher = false
        displayedImages[0].style.transition = speed + 'ms'
        displayedImages[0].style.marginLeft = 0 + 'rem'
        setTimeout(() => {
            for (let i = 0; i < amountOfSlidesPerSlide; i++) {
                indexNext -= 1
                indexPrev -= 1
                if (indexNext < 0) indexNext = images.length - 1
                if (indexPrev < 0) indexPrev = images.length - 1
                displayedImages[displayedImages.length-1].remove()
                const img = drawNewImg(indexNext)
                displayedImages.unshift(img)
                displayedImages.pop()
                sliderTrack.prepend(img)
            }
            displayedImages[0].style.marginLeft = -(imgWidth * amountOfSlidesPerSlide) + 'rem'
            slideSwitcher = true
        }, speed)
    } else {
        return
    }
}

function slidePrev() {
    if (slideSwitcher) {
        slideSwitcher = false
        displayedImages[0].style.transition = speed + 'ms'
        displayedImages[0].style.marginLeft = -imgWidth * (2 * amountOfSlidesPerSlide) + 'rem'
        setTimeout(() => {
            for (let i = 0; i < amountOfSlidesPerSlide; i++) {
                if (indexPrev > images.length - 1) indexPrev = 0
                if (indexNext > images.length - 1) indexNext = 0
                displayedImages[0].remove() 
                const img = drawNewImg(indexPrev)
                displayedImages.push(img)
                displayedImages.shift()
                sliderTrack.append(img)
                indexPrev += 1
                indexNext += 1
            }
            displayedImages[0].style.transition = 0 + 's'
            displayedImages[0].style.marginLeft = -imgWidth * amountOfSlidesPerSlide + 'rem'
            slideSwitcher = true
        }, speed)
    } else {
        return
    }
}

function handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    touchStartTime = Date.parse(new Date)
    displayedImages[0].style.transition = 0 + 'ms'
    initialCoords.x = event.pageX
    const style = displayedImages[0].currentStyle || window.getComputedStyle(displayedImages[0]);
    marginLeft = style.marginLeft
    mouseClickedOnTheElement = true
}

function handleMouseMove(event) {
    event.preventDefault();
    event.stopPropagation();
    if (mouseClickedOnTheElement) {
        currentCoords.x = event.pageX
        mouseRelativePosition = parseInt(currentCoords.x) - parseInt(initialCoords.x)
        displayedImages[0].style.marginLeft = (parseInt(marginLeft) + mouseRelativePosition) + 'px'
    }
}

function handleMouseUp(event) {
    
    event.preventDefault();
    event.stopPropagation();
    touchEndTime = Date.parse(new Date)
    if (mouseClickedOnTheElement) {
        if (mouseRelativePosition > 0) {
            handleSlide(slideNext)
        } else {
            handleSlide(slidePrev)
        }
        mouseRelativePosition = 0
        mouseClickedOnTheElement = false
    }  
}


function drawNewImg(index) {
    const img = document.createElement('img')
    img.src = images[index]
    img.style.width = imgWidth + 'rem'
    img.style.height = initialImgHeight + 'rem'
    return img
}

function handleSlide(callback) {
    if (Math.abs(mouseRelativePosition) > 10 && Math.abs(mouseRelativePosition) > Math.abs(parseInt(marginLeft)/2)) {
        callback()
    } else {
        if (Math.abs(mouseRelativePosition) > 10 && touchEndTime - touchStartTime < 200) {
            callback()
        } else {
            displayedImages[0].style.transition = speed + 'ms'
            displayedImages[0].style.marginLeft = parseInt(marginLeft) + 'px'
        }
    }
}


drawInitialImages()
next.addEventListener('click', slideNext)
prev.addEventListener('click', slidePrev)
sliderTrack.addEventListener('mousedown', handleMouseDown)
sliderTrack.addEventListener('mousemove', handleMouseMove)
window.addEventListener('mouseup', handleMouseUp)

