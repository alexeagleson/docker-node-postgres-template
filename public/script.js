fetch("/employees")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.forEach((employee) => {
      const cardTemplate = document.querySelector('template');
      const card = cardTemplate.content.cloneNode(true);
      card.querySelector('h4').innerText = employee.name;
      card.querySelector('p').innerText = employee.title;

      // const p = document.createElement("p");
      // p.innerText = employee.name;
      document.body.appendChild(card);
    });
  });
