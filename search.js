class View {
  constructor() {
    this.app = document.getElementById("app");

    this.searchLine = this.createElement("div", "search-line");
    this.searchInput = this.createElement("input", "search-input");
    this.searchCounter = this.createElement("span", "counter");
    this.searchLine.append(this.searchInput);
    this.searchLine.append(this.searchCounter);

    this.usersWrapper = this.createElement("div", "users-wrapper");
    this.usersList = this.createElement("div", "users");
    this.usersWrapper.append(this.usersList);

    this.main = this.createElement("div", "main");

    this.main.append(this.usersWrapper);
    this.app.append(this.searchLine);
    this.app.append(this.main);

    this.listedItems = document.getElementById("list");
    this.listed = this.createElement("div", "listed-item");
    this.listedItems.append(this.listed);
  }

  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }

  createSearchResult(repoData) {
    const searchResult = this.createElement("div", "searchResult");

    //получила имя репозитория
    searchResult.addEventListener("click", handleClick.bind(this));

    // вывела имена репов в результат выдачи поиска
    searchResult.innerHTML = `${repoData.name}`;
    this.usersList.append(searchResult);

    /*
    handleClick >> при клике на выбранный репозиторий необходимо создать новый элеемент
    с необходимым содержимым + кнопку + реализовать возможность удаления
    из списка + очистку поисковой строки
    */
    function handleClick(event) {
      event.currentTarget;

      //очистка поискового поля
      this.searchInput.value = "";

      // далее - необходимо создание и вывод "кликнутых" элементов в список внизу страницы
      let addedEl1 = document.createElement("div");
      let addedEl2 = document.createElement("div");
      let addedEl3 = document.createElement("div");

      addedEl1.classList.add("list-item");
      addedEl2.classList.add("list-item");
      addedEl3.classList.add("list-item");

      addedEl1.innerHTML = `Name: ${repoData.name}`;
      addedEl2.innerHTML = `Owner: ${repoData.owner.login}`;
      addedEl3.innerHTML = `Stars: ${repoData["stargazers_count"]}`;

      const card = document.createElement("div");
      card.classList.add("card");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      let closeBtn = document.createElement("button");
      closeBtn.classList.add("close-btn");

      // реализуем возможность удаления из списка
      closeBtn.addEventListener("click", function remove() {
        card.remove();
        closeBtn.remove();
      });

      // теперь все созданное необходимо ввести в блок для последующего отображения
      cardBody.appendChild(addedEl1);
      cardBody.appendChild(addedEl2);
      cardBody.appendChild(addedEl3);
      cardBody.appendChild(closeBtn);

      card.appendChild(cardBody);

      this.listed.appendChild(card);
    }
  }
}

class Search {
  constructor(view) {
    this.view = view;

    //тут происходит действо - вбиваем в поиск и получаем выдачу результатов на основании всех указанных функций в коде
    this.view.searchInput.addEventListener(
      "keyup",
      this.debounce(this.searchUsers.bind(this), 500)
    );
  }

  async searchUsers() {
    //foundRepos - то, что вбила в поисковую строку
    let foundRepos = this.view.searchInput.value;

    if (foundRepos) {
      this.clearResults();
      return await fetch(
        `https://api.github.com/search/repositories?q=${foundRepos}&per_page=5`
      ).then((response) => {
        return response.json().then((res) => {
          for (let i = 0; i < res.items.length; i++) {
            this.view.createSearchResult(res.items[i]);
          }
        });
      });
    } else {
      this.clearResults();
    }
  }

  clearResults() {
    this.view.usersList.innerHTML = "";
  }

  debounce(fn, debounceTime) {
    let count;
    return function (...args) {
      clearTimeout(count);
      count = setTimeout(() => {
        fn.apply(this, args);
      }, debounceTime);
    };
  }
}

new Search(new View());
