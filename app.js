// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyDj-I2vJRWNh6pKaKDTkHWUAzdNKsMcDW4",
authDomain: "vanillajs-c5fd5.firebaseapp.com",
databaseURL: "https://vanillajs-c5fd5.firebaseio.com",
projectId: "vanillajs-c5fd5",
storageBucket: "vanillajs-c5fd5.appspot.com",
messagingSenderId: "4117620678",
appId: "1:4117620678:web:9ac2cd65ce1e353594f4c7",
measurementId: "G-4HR4BJT1FK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()


const ul = document.querySelector('.list-container')
const form = document.querySelector('form')
//Function Add
const addRecipe = (recipe, id) => {
    let date = new Date(recipe.created_at.toDate())
    let li = document.createElement('li')
    li.classList.add('list-group-item', 'd-flex', 'li-add')
    li.setAttribute('data-id', id)
    li.innerHTML = `<div class="flex-grow-1">${recipe.title}</div>
    <div class="mr-2">${date.getDate()} / ${date.getMonth()+1} / ${date.getFullYear()}</div>
    <img class="m-auto" src="https://img.icons8.com/officexs/16/000000/delete-sign.png"/>`
    ul.appendChild(li)
    setTimeout(() => {
        li.classList.add('add')
    },100)
    // li.innerHTML += `<li class="list-group-item d-flex" data-id="${id}">
    // <div class="flex-grow-1">${recipe.title}</div>
    // <div class="mr-2">${date.getDate()} / ${date.getMonth()+1} / ${date.getFullYear()}</div>
    // <img class="m-auto" src="https://img.icons8.com/officexs/16/000000/delete-sign.png"/>
    // </li>`
}
//Function Delete
const deleteRecipe = id => {
    [...ul.children].forEach(li => {
        if(li.getAttribute('data-id') === id){
            li.classList.remove('li-add', 'add')
            
            setTimeout(() => {
                li.classList.add('li-delete') 
            },10)
            setTimeout(() => {
                li.remove()
            },700) 
        } 
    })
}




//Realtime UI update
db.collection('recipes').onSnapshot(snap => {
    snap.docChanges().forEach(change => {
        if(change.type === 'added') addRecipe(change.doc.data(), change.doc.id)
        if(change.type === 'removed') deleteRecipe(change.doc.id)
    })
    
})

//Get data from firebase
// db.collection('recipes')
// .get()
// .then((data) => { data.docs.forEach(data => addRecipe(data.data(), data.id)) })
// .catch(err => console.log(err))

//Add new recipe
form.addEventListener('submit', e => {
    e.preventDefault()
    const now = new Date()
    const recipe = {
        title: form.recipe.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    }
    db.collection('recipes')
    .add(recipe)
    .then(() => console.log('Success!'))
    .catch(err => console.log(err)) 
    form.reset()
})

//Delete recipe
ul.addEventListener('click', e => {
    if(e.target.tagName === 'IMG'){
        const id = e.target.parentElement.getAttribute('data-id')
        db.collection('recipes')
        .doc(id)
        .delete()
        .then(() => console.log('Deleted!'))
        .catch(err => console.log(err))
    }
})
  
  