fetch("posts.json")
  .then(posts => posts.json())
  .then(posts => posts.map((entry, i) => ({
    ...entry,
    "date": new Date(entry.date),
    "text": Object.assign(document.createElement("div"), {
      innerHTML: entry.text,
      className: "post",
      id: String(i + 1).padStart(2, 0)
    })
  })))
  .then(posts => posts.map(entry => {
    if (entry.hasOwnProperty("ask")) {
      let ask = document.createElement("p");
      let name;
      if (!entry.ask.hasOwnProperty("name")) {
        name = "Anonymous";
      } else {
        name = `<a href="${entry.ask.url}">${entry.ask.name}</a>`;
      }
      ask.innerHTML = `<strong>${name} asked: ${entry.ask.text}</strong>`;
      entry.text.prepend(ask);
    }
    return entry;
  }))
  .then(posts => posts.map((entry, i) => {
    let top = document.createElement("div");
    top.className = "top";
    top.innerHTML = `<a href="#${String(i + 1).padStart(2, 0)}">${String(i + 1).padStart(2, 0)}</a> • `;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    top.innerHTML += `<time datetime="${entry.date.toISOString()}">${
      String(entry.date.getUTCHours()).padStart(2, 0) + ":" +
      String(entry.date.getUTCMinutes()).padStart(2, 0) +
      " " + monthNames[entry.date.getUTCMonth()] +
      " " + String(entry.date.getUTCDate()).padStart(2, 0) +
      " " + entry.date.getUTCFullYear()
    }</time>`;
    if (i !== 0) {
      let diff =  Math.round((entry.date.getTime() - posts[i - 1].date.getTime()) / (1000 * 60 * 60 * 24));
      let s = diff > 1 ? "s" : "";
      if (diff !== 0) top.innerHTML += ` (${diff} day${s} later)`;
    }
    top.innerHTML += " • ";

    top.innerHTML += `<a href="${entry.url}">Original post</a> • <a href="${entry.archive}">Archived copy</a>`;

    entry.text.prepend(top);

    let tags = document.createElement("div");
    tags.className = "tags";
    entry.tags.forEach(tag => {
      tags.innerHTML += `<span class="tag" title="${tag}">${tag}</span>`;
    });
    entry.text.append(tags);

    return entry;
  }))
  .then(posts => {
    let nav = document.getElementById("pages");
    posts.forEach((p, i) => {
      let l = document.createElement("a");
      l.href = `#${String(i + 1).padStart(2, 0)}`;
      l.textContent = String(i + 1).padStart(2, 0);
      nav.append(l);
    });
    return posts;
  })
  .then(posts => {
    let main = document.getElementById("main");
    posts.forEach(post => {
      main.appendChild(post.text);
    });
  });

let info = () => {
  let i = document.getElementById("info");
  i.style.display === "block" ? i.style.display = "none" : i.style.display = "block";
};

document.getElementById("info").style.display = "none";
