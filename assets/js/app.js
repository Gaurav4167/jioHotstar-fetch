var cl = console.log;

const addBtnMain = document.getElementById("addBtnMain")
const title = document.getElementById("title")
const type = document.getElementById("type")
const poster = document.getElementById("poster")
const description = document.getElementById("description")
const date = document.getElementById("date")
const rating = document.getElementById("rating")
const addBtn = document.getElementById("addBtn")
const updateBtn = document.getElementById("updateBtn")
const button = document.getElementById("button")
const form = document.getElementById("form")
const cardContainer = document.getElementById("cardContainer")
const formColumn = document.getElementById("formColumn")
const crossMark = document.getElementById("crossMark")
const formTitle = document.getElementById("formTitle")
const spinner = document.getElementById("spinner")

const BASE_URL = `https://gaurav2-1b96d-default-rtdb.firebaseio.com/`
const MOVIE_URL = `${BASE_URL}/jioHotstar.json`


const state = {
    moviesArray: [],
    edit_id: null,
}

const updatedMovies = [];
if (!sessionStorage.getItem("updatedMoviesArr")) {
    sessionStorage.setItem("updatedMoviesArr", JSON.stringify(updatedMovies))
}
const updatedMoviesArr = JSON.parse(sessionStorage.getItem("updatedMoviesArr"))
//-------------------------- GENERIC fun --------------------------------
function makeApiCall(URL, method, body) {
    body = body ? JSON.stringify(body) : null
    return fetch(URL, {
        method: method,
        body: body,
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
}

//============================= READ =================================
function readCards(arr) {
    showSpinner("text-primary")
    makeApiCall(MOVIE_URL, "GET")
        .then(data => {
            for (const key in data) {
                data[key].id = key;
                state.moviesArray.unshift(data[key])
            }
            makingStoredCards(arr)
        })
        .catch(err => {
            showSnackBar("Error", err, "error")
        })
         .finally(() => {
            hideSpinner("text-primary")
        })
}
readCards(state.moviesArray)
function makingStoredCards(movies) {
    let result = ""
    movies.forEach(ele => {
        if (updatedMoviesArr.includes(ele.title)) {
            result += `<div class="col-2" id=${ele.id}>
                <div class="row">
                   <div class="col-7">
                         <h3 class="mt-4">${ele.title}</h3>
                   </div>
                   <div class="col-2 offset-2 p-0">
                         <h3 class="mt-4  ${ratingBackground(ele.rating)} toprating">${ele.rating}</h3>
                   </div>

                </div>
                <div class="card resultCard">

                    <figure>
                        <img src="${ele.poster}"
                            class="img-fluid rounded-4" alt="">

                        <figcaption>
                            <h4>${ele.title}</h4>
                            <h5>Modified At: ${new Date(ele.updatedAt).toLocaleDateString()}</h5>
                            <p>${ele.description}</p>
                        </figcaption>
                    </figure>
                    <div class="row cardRow">
                        <div class="col-3 buttons editbutton">
                            <i onClick="editMovie(this)" role = button class="fa-solid fa-pen-to-square text-primary ml-2"></i>
                        </div>
                        <div class="col-3 offset-10 buttons">
                            <i onClick="deleteMovie(this)" role = button class="fa-solid fa-trash text-danger"></i>
                        </div>
                    </div>
                </div>
            </div>`
        } else {
            result += `<div class="col-2" id=${ele.id}>
                <div class="row">
                   <div class="col-7">
                         <h3 class="mt-4">${ele.title}</h3>
                   </div>
                   <div class="col-2 offset-2 p-0">
                         <h3 class="mt-4  ${ratingBackground(ele.rating)} toprating">${ele.rating}</h3>
                   </div>

                </div>
                <div class="card resultCard">

                    <figure>
                        <img src="${ele.poster}"
                            class="img-fluid rounded-4" alt="">

                        <figcaption>
                            <h4>${ele.title}</h4>
                            <p>${ele.description}</p>
                        </figcaption>
                    </figure>
                    <div class="row cardRow">
                        <div class="col-3 buttons editbutton">
                            <i onClick="editMovie(this)" role = button class="fa-solid fa-pen-to-square text-primary ml-2"></i>
                        </div>
                        <div class="col-3 offset-10 buttons">
                            <i onClick="deleteMovie(this)" role = button class="fa-solid fa-trash text-danger"></i>
                        </div>
                    </div>
                </div>
            </div>`
        }
    })
    cardContainer.innerHTML = result
}
//============================= CREATE =================================
function createNewMovie(eve) {
    eve.preventDefault()
    let newMovie = {
        title: title.value,
        poster: poster.value,
        description: description.value,
        type: type.value,
        rating: rating.value,
        date: date.value,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }

    showSpinner("text-success")
    makeApiCall(MOVIE_URL, "POST", newMovie)
        .then(data => {
            newMovie.id = data.name;
            state.moviesArray.unshift(newMovie)

            // cl(state.moviesArray)
            let col = document.createElement("div")
            col.className = "col-2"
            col.id = data.name
            col.innerHTML = `
             <div class="row">
                   <div class="col-7">
                         <h3 class="mt-4">${newMovie.title}</h3>
                   </div>
                   <div class="col-2 offset-2 p-0">
                         <h3 class="mt-4  ${ratingBackground(newMovie.rating)} toprating">${newMovie.rating}</h3>
                   </div>

                </div>
            <div class="card resultCard">

                    <figure>
                        <img src="${newMovie.poster}"
                            class="img-fluid rounded-4" alt="">

                        <figcaption>
                            <h4>${newMovie.title}</h4>
                            <p>${newMovie.description}</p>
                        </figcaption>

                    </figure>
                    <div class="row cardRow">
                        <div class="col-3 buttons editbutton">
                            <i onClick="editMovie(this)" role = button class="fa-solid fa-pen-to-square text-primary ml-2"></i>
                        </div>
                        <div class="col-3 offset-10 buttons">
                            <i onClick="deleteMovie(this)" role = button class="fa-solid fa-trash text-danger"></i>
                        </div>
                    </div>
                </div>`
            cardContainer.prepend(col)
            clearForm()
            hideForm()
             showSnackBar("Added!", "Movie Added successfully", "success")
        })
        .catch(err => {
            showSnackBar("Error", err, "error")
        })
        .finally(() => {
            hideSpinner("text-success")
        })
}

//============================= EDIT =================================
function editMovie(ele) {
    let EDIT_ID = ele.closest(".col-2").id;
    let EDIT__URL = `${BASE_URL}/jioHotstar/${EDIT_ID}.json`

    showSpinner("text-success")
    makeApiCall(EDIT__URL, "GET")
        .then(data => {
            showForm()

            title.value = data.title
            poster.value = data.poster
            type.value = data.type
            description.value = data.description
            date.value = data.date
            rating.value = data.rating

            addBtnMain.disabled = true;
            // ele.nextElementSibling.disabled = true

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })

            formTitle.innerText = "Update Movie"

            state.edit_id = EDIT_ID

            addBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
        })
        .catch(err => {
            showSnackBar("Error", err, "error")
        })
        .finally(() => {
            hideSpinner("text-success")
        })
}
//============================= UPDATE =================================
function updatedSelectedMovie(eve) {
    let UPDATE_ID = state.edit_id;
    state.edit_id = null
    let UPDATE_URL = `${BASE_URL}/jioHotstar/${UPDATE_ID}.json`
    let updatedMovieObj = {
        title: title.value,
        poster: poster.value,
        description: description.value,
        type: type.value,
        rating: rating.value,
        date: date.value,
        createdAt: state.moviesArray.createdAt,
        updatedAt: Date.now(),
        id: UPDATE_ID,
    }

    showSpinner("text-success")
    makeApiCall(UPDATE_URL, "PATCH", updatedMovieObj)
        .then(data => {
            document.getElementById(UPDATE_ID).innerHTML = `
         <div class="row">
                   <div class="col-7">
                         <h3 class="mt-4">${updatedMovieObj.title}</h3>
                   </div>
                   <div class="col-2 offset-2 p-0">
                         <h3 class="mt-4  ${ratingBackground(updatedMovieObj.rating)} toprating ">${updatedMovieObj.rating}</h3>
                   </div>

                </div>
            <div class="card resultCard">

                    <figure>
                        <img src="${updatedMovieObj.poster}"
                            class="img-fluid rounded-4" alt="">

                        <figcaption>
                            <h4>${updatedMovieObj.title}</h4>
                            <h5>Modified At: ${new Date(updatedMovieObj.updatedAt).toLocaleDateString()}</h5>
                            <p>${updatedMovieObj.description}</p>
                        </figcaption>

                    </figure>
                    <div class="row cardRow">
                        <div class="col-3 buttons editbutton">
                            <i onClick="editMovie(this)" role = button class="fa-solid fa-pen-to-square text-primary ml-2"></i>
                        </div>
                        <div class="col-3 offset-10 buttons">
                            <i onClick="deleteMovie(this)" role = button class="fa-solid fa-trash text-danger"></i>
                        </div>
                    </div>
                </div>
                `

            updateBtn.classList.add("d-none")
            addBtn.classList.remove("d-none")
            //Local State Management
            let getIndex = state.moviesArray.findIndex(ele => ele.id === UPDATE_ID)
            state.moviesArray[getIndex] = updatedMovieObj;
            cl(getIndex)

            //Storing Movies Title for Update Value Showing
            updatedMoviesArr.unshift(data.title)
            sessionStorage.setItem("updatedMoviesArr", JSON.stringify(updatedMoviesArr))

            clearForm()
            hideForm()
            showSnackBar("Updated!", "Movie updated successfully", "success")
        })
        .catch(err => {
            
            showSnackBar("Error", err, "error")
        })
         .finally(() => {
            hideSpinner("text-success")
        })
}
//============================= DELETE =================================
function deleteMovie(ele) {
    let DELETE_ID = ele.closest(".col-2").id
    let DELETE_URL = `${BASE_URL}/jioHotstar/${DELETE_ID}.json`
    Swal.fire({
        title: "Are you sure?",
        text: "Movie removed permanently..",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            showSpinner("text-danger")
            makeApiCall(DELETE_URL, "DELETE")
                .then(data => {
                    let getIndex = state.moviesArray.findIndex(ele => ele.id === DELETE_ID)
                    state.moviesArray.splice(getIndex, 1)
                    ele.closest(".col-2").remove()
                    showSnackBar("Removed!", "Movie removed successfully", "success")

                })
                .catch(err => {
                    showSnackBar("Error", err, "error")
                })
                .finally(() => {
                    hideSpinner("text-danger")
                })
        }
    })

}
function showForm(eve) {
    formColumn.style.top = "20%"
    formColumn.style.opacity = "1"
    formColumn.style.transition = "all 0.3s linear"
    formTitle.innerText = "Add Movie"

}
function hideForm() {
    formColumn.style.opacity = "0";
    formColumn.style.top = "-100vh"
    formColumn.style.transition = "0.5s linear all"
    formTitle.innerText = "Add Movie"
    addBtnMain.disabled = false;
    document.querySelectorAll("#removeMovieBtn").forEach(ele => ele.disabled = false) // Enabled all remove buttons
    updateBtn.classList.add("d-none")
    addBtn.classList.remove("d-none")
    clearForm()

    // formColumn.classList.add("d-none")
}
function clearForm() {
    form.reset()
    formTitle.innerText = "Add Movie"
}
function ratingBackground(rating) {
    if (rating >= 8) {
        return "bg_green"
    } else if (rating >= 4) {
        return "bg_orange"
    } else {
        return "bg_red"
    }
}

function showSnackBar(title, msg, icon) {
    Swal.fire({
        title: title,
        text: msg,
        icon: icon
    });
}
function showSpinner(color) {
    spinner.classList.remove("d-none")
    spinner.classList.add(color)
}
function hideSpinner(color) {
    spinner.classList.add("d-none")
    spinner.classList.remove(color)
}
form.addEventListener("submit", createNewMovie)
addBtnMain.addEventListener("click", showForm)
crossMark.addEventListener("click", hideForm)
updateBtn.addEventListener("click", updatedSelectedMovie)
clearBtn.addEventListener("click", clearForm)












