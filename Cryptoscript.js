$(() => {
  /*an array which contains all the selected coins*/
  let ArrSelectedCoin = [];
  let SymbolSelectedCoin = [];
  /* הגדרת מערך שיכיל את כל המטבעות שהוסרו בחלון הקופץ */
  let RemovedCoinsArr = [];
  let AllCoins = [];
  // ----------For Reports Elements---------
  let currentCurrencyArr1 = [];
  let currentCurrencyArr2 = [];
  let currentCurrencyArr3 = [];
  let currentCurrencyArr4 = [];
  let currentCurrencyArr5 = [];
  let CoinsRealTime = [];
  let interval;
  // -------------------------------------------------------------//

  // api גישה ל
  $("#BodyPage").html($progressbar);
  move();

  $("#BodyPage").html("");
  if (sessionStorage.getItem("AllCoins")) {
    AllCoins = JSON.parse(sessionStorage.getItem("AllCoins"));
    for (let coin of AllCoins) {
      AddCard(coin);
    }
  } else {
    $.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=current_price_desc&per_page=100&page=1&sparkline=false",
      (coins) => {
        AllCoins = coins;
        sessionStorage.setItem("AllCoins", JSON.stringify(coins));
        for (let coin of AllCoins) {
          AddCard(coin);
        }
      }
    );
  }

  // ----לחיצה על דף המטבעות---------
  $(".AllCoinsPage").click(() => {
    currentCurrencyArr1 = [];
    currentCurrencyArr2 = [];
    currentCurrencyArr3 = [];
    currentCurrencyArr4 = [];
    currentCurrencyArr5 = [];

    clearInterval(interval);

    $("#BodyPage").html($progressbar);
    move();
    $("#BodyPage").html("");

    AllCoins = JSON.parse(sessionStorage.getItem("AllCoins"));
    for (const coin of AllCoins) {
      AddCard(coin);
    }
  });

  // ----לחיצה על דף דוחות---------
  $(".LiveReportsPage").click(() => {
    SymbolSelectedCoin = [];
    interval = 0;
    AllCoins = JSON.parse(sessionStorage.getItem("AllCoins"));
    for (const coin of AllCoins) {
      if (ArrSelectedCoin.includes(coin.id)) {
        SymbolSelectedCoin.push(coin.symbol);
        console.log(coin.id + " this is : " + coin.symbol);
      }
    }

    if (SymbolSelectedCoin.length === 0) {
      alert("Please Select 1-5 coins to see the Live report");
    } else {
      interval = setInterval(() => {
        GraphData();
      }, 2000);
      $("#BodyPage").html($progressbar);
      move();
    }
  });

  function GraphData() {
    $.get(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${SymbolSelectedCoin[0]},${SymbolSelectedCoin[1]},${SymbolSelectedCoin[2]},${SymbolSelectedCoin[3]},${SymbolSelectedCoin[4]}&tsyms=USD`,
      (data) => {
        if (data.Response === "Error") {
          $("#BodyPage").html(
            `<div class="messagenotselected"> <h2>No data on selected currencies</h2> </div>`
          );
        } else {
          $("#BodyPage").html($Report);
          let currentDate = new Date();
          let counter = 1;
          CoinsRealTime = [];

          for (let key in data) {
            switch (counter) {
              case 1:
                currentCurrencyArr1.push({ x: currentDate, y: data[key].USD });
                CoinsRealTime.push(key);
                break;
              case 2:
                currentCurrencyArr2.push({ x: currentDate, y: data[key].USD });
                CoinsRealTime.push(key);
                break;
              case 3:
                currentCurrencyArr3.push({ x: currentDate, y: data[key].USD });
                CoinsRealTime.push(key);
                break;
              case 4:
                currentCurrencyArr4.push({ x: currentDate, y: data[key].USD });
                CoinsRealTime.push(key);
                break;
              case 5:
                currentCurrencyArr5.push({ x: currentDate, y: data[key].USD });
                CoinsRealTime.push(key);
                break;
            }
            counter++;
          }
          DisplayGraph();
        }
      }
    );
  }
  function DisplayGraph() {
    let chart = new CanvasJS.Chart("chartContainer", {
      // display the graph using the jquery:canvas.js
      title: {
        text: `Selected Coins: ${SymbolSelectedCoin} to USD`,
      },

      subtitles: [
        {
          text: "Hover the charts to see currency rate",
        },
      ],
      axisX: {
        valueFormatString: "HH:mm:ss",
        titleFontColor: "red",
      },

      axisY: {
        title: "Coin Value",
        titleFontColor: "red",
        lineColor: "#4F81BC",
        labelFontColor: "#4F81BC",
        tickColor: "#4F81BC",
        includeZero: false,
      },

      axisY2: {
        title: "",
        titleFontColor: "#C0504E",
        lineColor: "#C0504E",
        labelFontColor: "#C0504E",
        tickColor: "#C0504E",
        includeZero: false,
      },
      toolTip: {
        shared: true,
      },

      legend: {
        cursor: "pointer",
        itemclick: toggleDataSeries,
      },

      data: [
        {
          type: "line",
          name: CoinsRealTime[0],
          showInLegend: true,
          xValueFormatString: "HH:mm",
          dataPoints: currentCurrencyArr1,
        },

        {
          type: "line",
          name: CoinsRealTime[1],
          showInLegend: true,
          xValueFormatString: "HH:mm",
          dataPoints: currentCurrencyArr2,
        },

        {
          type: "line",
          name: CoinsRealTime[2],
          showInLegend: true,
          xValueFormatString: "HH:mm",
          dataPoints: currentCurrencyArr3,
        },

        {
          type: "line",
          name: CoinsRealTime[3],
          showInLegend: true,
          xValueFormatString: "HH:mm",
          dataPoints: currentCurrencyArr4,
        },

        {
          type: "line",
          name: CoinsRealTime[4],
          showInLegend: true,
          xValueFormatString: "HH:mm",
          dataPoints: currentCurrencyArr5,
        },
      ],
    });

    chart.render();

    function toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    }
  }
  // --Click On AboutPage---------
  $(".AboutPage").click(() => {
    clearInterval(interval);
    $("#BodyPage").html(`
    <div class="about">
    <img class="mypicture" src="Images/my-passport-photo1.jpg" alt="picture-for-me">

          <div class=""personal-info-container>
          <div class="personal-details">
          Hi I am Ameer Emran, I'm 33 years old. I love coding 😎.
          I am doing my best in my course "FullStack Development", so I really hope for success.
          </div>
                   
          <div class="personal-details">
          This project includes: HTML, CSS, JavaScript, AJAX Api, JQuery , Canvas JS , Bootstrap and more.</div>
          As a part of my studies, I made this jQuery-AJAX API project which is about the virtual commerce.
          You can check out the displayed currencies and see their values in EUR, USD and NIS.
          in addition users can view real-time prices of cryptocurrencies and can search for their favorite cryptocurrencies.
          and can manage (add/remove) their favorite cryptocurrencies (report list).
          
          </div>
          </div>
            



        </div>
    `);
  });
  // ------Function which makes a card for every coin-----------------
  function AddCard(coin) {
    console.log(coin);
    $("#BodyPage").append(`
    <div class="card">
    <div class="card-body" id="card${coin.id}">
    <label class="switch">
    <input type="checkbox" id="${coin.id}-id">
    <span class="slider round"></span>
    </label>
    <h5 class="card-title coinSymbol">${coin.symbol}</h5>
    <p class="card-text coinId">${coin.id}</p>
    <a class="btn btn-primary" id=Btn${coin.id}>More info</a>
    <div class="MoreInfoDiv" id=DivInfo${coin.id}>
    </div>
    
    </div>
    
    </div>
    `);
    if (ArrSelectedCoin.length > 0) {
      ArrSelectedCoin.forEach((selectedCoin) => {
        if (selectedCoin == coin.id) {
          $(`#${selectedCoin}-id`).prop("checked", true);
        }
      });
    }

    // -----More Info for every coin-----------------

    $(`#Btn${coin.id}`).click(() => {
      // click more info button and you will get this:
      $(`#DivInfo${coin.id}`).slideToggle("slow");
      getMoreInfoBtn(coin.id);
    });
    // -------Save the Coin--------
    $(`#${coin.id}-id`).click((e) => {
      toggleButtons(coin);
    });
    // ----------------------------------------------------
  }

  const removeCoins = () => {
    ArrSelectedCoin.forEach((selectedCoin) => {
      $(`#${selectedCoin}-id1`).on("click", () => {
        if ($(`#${selectedCoin}-id1`).prop("checked")) {
          let removeItem1 = selectedCoin;
          RemovedCoinsArr.splice($.inArray(removeItem1, RemovedCoinsArr), 1);
        } else {
          RemovedCoinsArr.push(selectedCoin);
        }
      });
    });
  };

  let toggleButtons = (coinchoice) => {
    //function for click on the choice button

    console.log(ArrSelectedCoin);
    if ($(`#${coinchoice.id}-id`).prop("checked")) {
      if (ArrSelectedCoin.length >= 5) {
        Swal.fire({
          title: "You can pick only 5 coins!",
          icon: "warning",
          html: popWindowContent(coinchoice),
          showCancelButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          reverseButtons: true,
        }).then((result) => {
          if (result.value) {
            // click ok

            if (RemovedCoinsArr.length > 0) {
              for (let removeCoin of RemovedCoinsArr) {
                $(`#${removeCoin}-id`).prop("checked", false);
                let removeItem = removeCoin;
                ArrSelectedCoin.splice(
                  $.inArray(removeItem, ArrSelectedCoin),
                  1
                );
                console.log(ArrSelectedCoin);
              }

              console.log("Remove : " + RemovedCoinsArr);
              $(`#${coinchoice.id}-id`).prop("checked");

              console.log(ArrSelectedCoin);
            } else {
              console.log("not chosen");
              $(`#${coinchoice.id}-id`).prop("checked", false);
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // click cancel

            $(`#${coinchoice.id}-id`).prop("checked", false);
            ArrSelectedCoin.pop();
            return false;
          }
          RemovedCoinsArr = [];
        });
      }
      console.log("Choosen!");
      ArrSelectedCoin.push(coinchoice.id);

      removeCoins();
    } else {
      console.log("Not choosen");
      let removeItem = coinchoice.id;
      ArrSelectedCoin.splice($.inArray(removeItem, ArrSelectedCoin), 1);
      console.log(ArrSelectedCoin);
    }
    sessionStorage.setItem("ArrSelectedCoin", ArrSelectedCoin);
  };

  // function which describe the window which the client get if he chosed more than 5 coins
  const popWindowContent = () => {
    let toggle = `<ul class="toggledCoins">`;
    ArrSelectedCoin.forEach((selectedCoins) => {
      toggle += `
      <li>
          <span class="coinsToggle"> ${selectedCoins} </span>
          <div class="on-off-btn">
             <label class="switch button-toggle" >
                <input type="checkbox" checked="checked" id="${selectedCoins}-id1">
                <span class="slider round" ></span>
             </label>   
           </div>

      </li>`;
    });

    toggle += `</ul>`;
    return toggle;
  };

  // more information
  function getMoreInfoBtn(coinId) {
    $(`#DivInfo${coinId}`).html($progressbar);
    move();
    let currectTime = Date.now();
    let CoinSavedTolocal = JSON.parse(sessionStorage.getItem(`${coinId}`));
    if (
      CoinSavedTolocal != null &&
      currectTime - CoinSavedTolocal.time < 120000
    ) {
      console.log("information from the local");

      $(`#DivInfo${coinId}`).html(`
              <img class="DivInfoImage" src=${CoinSavedTolocal.image.small} alt="${coinId}">
              <p class="USD">${CoinSavedTolocal.market_data.current_price.usd} $</p>
              <p class="EUR">${CoinSavedTolocal.market_data.current_price.eur} €</p>
              <p class="ILS">${CoinSavedTolocal.market_data.current_price.ils} ₪</p>
            
              `);
    } else {
      console.log("Not found in local or 2 minutes have passed");
      $.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, (data) => {
        $(`#DivInfo${coinId}`).html(`
                        <img src=${data.image.small} alt="${coinId}">
                        <p class="USD">${data.market_data.current_price.usd} $</p>
                        <p class="EUR">${data.market_data.current_price.eur} €</p>
                        <p class="ILS">${data.market_data.current_price.ils} ₪</p>
                        `);
        data.time = Date.now();
        sessionStorage.setItem(`${data.id}`, JSON.stringify(data));
      });
    }
  }

  //------------------------Search Coin via coin name-----------------------------
  AllCoins = JSON.parse(sessionStorage.getItem("AllCoins"));
  $("#SearchInput").keyup(() => SearchFunction());
  $("#SearchButton").click(() => SearchFunction());
  let FilteredCoin;

  function SearchFunction() {
    if (!$("input").val()) {
      FilteredCoin = AllCoins;
    } else {
      FilteredCoin = AllCoins.filter((Fcoin) => {
        return Fcoin.symbol.toLowerCase() == $("input").val().toLowerCase();
      });
    }

    console.log(FilteredCoin);
    $("#BodyPage").empty();
    for (const coin of FilteredCoin) {
      AddCard(coin, JSON.parse(sessionStorage.getItem(`${coin.id}_Info`)));
    }
    if (!FilteredCoin.length) {
      $("#BodyPage").html(`
          <div>
          
          <img class="CoinNotFound" src="./Images/coin-not-found.png" alt="Coin Not Found">
          </div>
          `);
    }
  }

  // A function to load the timeline
  function move() {
    let width = 20;
    let i = 0;
    if (i == 0) {
      i = 1;
      let id = setInterval(frame, 10);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
          $("#ProgressBar").html(`${width}% We are ready...`);
        } else {
          width++;
          $("#ProgressBar").width(`${width}%`);
          $("#ProgressBar").html(`${width}%`);
        }
      }
    }
  }
});

let $progressbar = `<div id="myProgress">
<div id="ProgressBar">20%</div>
</div>`;
let $Report = `<div id="chartContainer"></div>`;
