let addToy = false;
const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let divCollect = document.querySelector('#toy-collection')
const baseURL = 'http://localhost:3000/toys';

const getToys = async () => {
  const res = await fetch(baseURL);
  return await res.json();
}

const postToy = async (toy_data) => {
  const res = await fetch(baseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      name: toy_data.name.value,
      image: toy_data.image.value,
      likes: 0
    })
  });
  const obj_toy = await res.json();
  const new_toy = renderToys(obj_toy);
  divCollect.append(new_toy);
}

const likes = async (e) => {
  e.preventDefault();
  const more = parseInt(e.target.previousElementSibling.innerText) + 1;
  const res = await fetch(`http://localhost:3000/toys/${e.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: more
    })
  });
  const like_obj = await res.json();
  e.target.previousElementSibling.innerText = `${more} likes`;
}

const renderToys = (toy) => {
  const h2 = document.createElement('h2');
  h2.innerText = toy.name;

  const img = document.createElement('img');
  img.setAttribute('src', toy.image);
  img.setAttribute('class', 'toy-avatar');

  const p = document.createElement('p');
  p.innerText = `${toy.likes} likes`;

  const btn = document.createElement('button');
  btn.setAttribute('class', 'like-btn');
  btn.setAttribute('id', toy.id);
  btn.innerText = "like";
  btn.addEventListener('click', (e) => {
    likes(e);
  });

  const divCard = document.createElement('div');
  divCard.setAttribute('class', 'card');
  divCard.append(h2, img, p, btn);
  divCollect.append(divCard);
}

// add listener to 'Add Toy' button to show or hide form
addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyForm.style.display = 'block';
    toyForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await postToy(event.target);
    });
  } else {
    toyForm.style.display = 'none';
  }
});

// start by getting all toys
getToys().then(toys => {
  toys.forEach(toy => {
    renderToys(toy);
  });
});