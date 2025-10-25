// Use this URL to fetch NASA APOD JSON data.
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

//varaibles that will be used throughout the script
const imgButton = document.getElementById('getImageBtn');
const gallery = document.getElementById('gallery'); //what holds the imgs/cards
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

// Get modal elements
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalExplanation = document.getElementById("modal-explanation");
const modalClose = document.getElementById("modal-close");

// Function to open modal with data
function openModal(img) {
  if (img.media_type === "image") {
    modalImg.src = img.url;
  } else if (img.media_type === "video") {
    // convert YouTube watch URL to embed if needed
    let videoUrl = img.url;
    if (img.url.includes("youtube.com/watch")) {
      const videoId = img.url.split("v=")[1];
      videoUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    modalImg.outerHTML = `<iframe src="${videoUrl}" frameborder="0" allowfullscreen style="width:100%;height:400px;border-radius:4px;"></iframe>`;
  }

  modalTitle.textContent = img.title;
  modalDate.textContent = img.date;
  modalExplanation.textContent = img.explanation;

  modal.style.display = "block";
}

// Close modal
modalClose.onclick = () => {
  modal.style.display = "none";

  // Reset img in case it was a video iframe
  const newImg = document.createElement("img");
  newImg.id = "modal-img";
  modal.querySelector(".modal-content").prepend(newImg);
};

//function to get NASA APOD data when user clicks a button
imgButton.addEventListener('click', function() {
  //getting the users choosen dates
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  //making sure the dates are vaild
   if (!startDate || !endDate) {
    gallery.innerHTML = `<p style="color:red;">Please select both a start and end date.</p>`;
    return;
  }

  //clear previous search
  gallery.innerHTML = '';

  let imgfound = false; // track if we found any images
  let count = 0; 

  //once dates are vailded then fetch data from APON JSON
  fetch(apodData)
    .then(response => response.json()) //parsing data to json so we can use it (so now data is a javaspcript array)
    .then (data => {
      //get imgs related to the users dates
      data.forEach(img => {//for each loop that iterates through each object in the array (img is the current object)
        if (img.date >= startDate && img.date <= endDate && count < 9){ // count < 9 it so that no more than 9 imgs show at a time
          imgfound = true; //if there are imgs in between the user's dates then continue
          count++
        
          //display imgs
          const imgDiv = document.createElement("div"); //creates a div for the imgs
          imgDiv.className = "gallery-item"//the class name of the new divs
          
          //inserting data into the div created above
          // Check if it's an image or video
        if (img.media_type === "image") {
            imgDiv.innerHTML = `
                <img src="${img.url}" alt="${img.title}" class="img">
                <h3>${img.title}</h3>
                <p>${img.date}</p>
                <p>${img.explanation}</p>
            `;
        } else if (img.media_type === "video") {
            imgDiv.innerHTML = `
                <iframe src="${img.url}" title="${img.title}" frameborder="0" allowfullscreen class="img"></iframe>
                <h3>${img.title}</h3>
                <p>${img.date}</p>
                <p>${img.explanation}</p>
            `;
        } 
        gallery.appendChild(imgDiv);//adds the div created into gallery where it holds the imgs/cards

        imgDiv.addEventListener("click", () => {
          openModal(img);
        });
      }
    });

      //if there is no img then display a message
        if (!imgfound) {
          gallery.innerHTML = `<p>No images found for this date range.</p>`;
        }
      })
      .catch(error => { //catches if there's an error fetching the data
        gallery.innerHTML = `<p style="color:red;">Error fetching data: ${error.message}</p>`;
        console.error('Error fetching APOD data:', error);
          
        })

})
