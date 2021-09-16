import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import { getWatchedFilmsChart, getTotalDuration, TypeOfStatistics } from '../../utils/statistic.js';
import SmartView from '../../utils/abstract/smart.js';
/* eslint-disable */
const ROW_HEIGHT = 50;

const renderGenresChart = (container, state) => {
  const { films, dateTo, dateFrom, currentInput } = state;
return
  const WatchedFilmsChart = getWatchedFilmsChart(films, dateTo, dateFrom, currentInput);
  container.height = ROW_HEIGHT * WatchedFilmsChart.uniqGenres.length;

  // код от коллеги
  return new Chart(container, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: WatchedFilmsChart.uniqGenres,
      datasets: [{
        data: WatchedFilmsChart.filmsByGenresCount,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createBtnsTemplate = (currentInput) => {
  let template = '';

  Object.values(TypeOfStatistics).forEach((type) => {
    template += `
      <input type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-${ type }"
        value="${ type }"
        ${ currentInput === type ? 'checked' : '' }>
      <label for="statistic-${ type }" class="statistic__filters-label">${ type }</label>`;
  });

  return template;
};

// абстрактная ф-ция для нахождения наиболее часто повторяющихся значений в массиве
const getMostFrequentlyRepeatedItems = (arr) => {
  return arr.reduce((acc, item) => {
    return (typeof acc[item] !== 'undefined')
      ? { ...acc, [item]: acc[item] + 1 }
      : { ...acc, [item]: 1 }
  }, {})
}

const getDataHistoryFilms = (films) => {
  const historyFilms = films.filter(item => item.userDetails.isAlreadyWatched ? item.userDetails.isAlreadyWatched : '')
  const watchedFilmsCount = historyFilms.length;
  const totalDuration = getTotalDuration(historyFilms);

  // *** вычисление топ жанров из просмотренных фильмов ***
  // жанры просмотренных фильмов
  const repeatingGenresHistoryFilms = historyFilms
    .map((film) => [...film.filmInfo.genre])
    .flat(1);

  const filteredByTopGenres = getMostFrequentlyRepeatedItems(repeatingGenresHistoryFilms)

  const getTopGenre = () =>  Object.entries(filteredByTopGenres)
      .reduce((acc, curr) => acc[1] > curr[1] ? acc : curr)[0];

  console.log(filteredByTopGenres)

  return {
    watchedFilmsCount,
    totalDuration,
    topGenre: getTopGenre
  }
}

const createStatsTemplate = (state, userRank) => {
  const { films, dateFrom, dateTo, currentInput } = state;

  // ---------------------------------
  const WatchedFilmsChart = getWatchedFilmsChart(films, dateTo, dateFrom, currentInput);

  return `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${ userRank }</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${ createBtnsTemplate(currentInput) }
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">
            ${ getDataHistoryFilms(films).watchedFilmsCount }
            <span class="statistic__item-description">movies</span>
          </p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">
            ${ Math.floor(getDataHistoryFilms(films).totalDuration / 60) }
            <span class="statistic__item-description">h</span>${ getDataHistoryFilms(films).totalDuration % 60 }
            <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">
            ${ getDataHistoryFilms(films).watchedFilmsCount > 0 ? getDataHistoryFilms(films).topGenre() : ''}
          </p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`;
};

export default class Statistics extends SmartView {
  constructor(films) {
    super();

    this._state = {
      films,
      dateFrom: (() => {
        const typeOfTime = 'year';
        return dayjs().subtract( 1 , typeOfTime).toDate();
      })(),
      dateTo: dayjs().toDate(),
      currentInput: TypeOfStatistics.ALL_TIME, // radio по умолчанию
    };

    this._userRank = document.querySelector('.profile__rating').textContent;
    this._genresChart = null;

    this._onClickStatisticsBtn = this._onClickStatisticsBtn.bind(this);
    this._setInnerHandlers();
    this._drawChart();
  }

  getTemplate() {
    return createStatsTemplate(this._state, this._userRank);
  }

  _drawChart() {
    if (this._genresChart !== null) {
      this._genresChart = null;
    }

    const container = this.getElement().querySelector('.statistic__chart');
    this._genresChart = renderGenresChart(container, this._state);
  }

  _onClickStatisticsBtn(evt) {
    if (evt.target.value === this._state.currentInput) {
      return;
    }

    this.updateState(
      {
        dateFrom: (() => {
          const typeOfTime = evt.target.value;
          return dayjs().subtract(1, typeOfTime).toDate();
        })(),
        currentInput: evt.target.value,
      },
    );
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll('.statistic__filters-input')
      .forEach((input) => input.addEventListener('click', this._onClickStatisticsBtn));
  }

  restoreAllHandlers() {
    this._drawChart();
    this._setInnerHandlers();
  }

  removeElement() {
    super.removeElement();

    if (this._genresChart !== null) {
      this._genresChart = null;
    }
  }
}
