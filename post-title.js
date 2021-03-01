// let scrollpos = window.scrollY
// const header = document.querySelector("#post-title")
// // const header_height = header.offsetHeight


// const add_class_on_scroll = () => header.classList.add("fade-in")
// const remove_class_on_scroll = () => header.classList.remove("fade-in")


// window.addEventListener('scroll', function() {
//   // const header = document.querySelector("#post-title")
//   const header_height = header.offsetHeight
   
//   scrollpos = window.scrollY

//   if (scrollpos >= header_height) { add_class_on_scroll() }
//   else { remove_class_on_scroll() }

//   console.log(scrollpos)
// })

// function runOnScroll() {
//   if(document.body.scrollTop >= 200) {
//     var title = document.getElementsByClassName("post-title");
//       title.style.color = "green";
//   }
// };

// window.addEventListener('scroll', runOnScroll)

// The debounce function receives our function as a parameter
const debounce = (fn) => {

  // This holds the requestAnimationFrame reference, so we can cancel it if we wish
  let frame;

  // The debounce function returns a new function that can receive a variable number of arguments
  return (...params) => {
    
    // If the frame variable has been defined, clear it now, and queue for next frame
    if (frame) { 
      cancelAnimationFrame(frame);
    }

    // Queue our function call for the next frame
    frame = requestAnimationFrame(() => {
      
      // Call our function and pass any params we received
      fn(...params);
    });

  } 
};

// Reads out the scroll position and stores it in the data attribute
// so we can use it in our stylesheets
const storeScroll = () => {
  document.documentElement.dataset.scroll = window.scrollY;
}

// Listen for new scroll events, here we debounce our `storeScroll` function
document.addEventListener('scroll', debounce(storeScroll), { passive: true });

// Update scroll position for first time
storeScroll();