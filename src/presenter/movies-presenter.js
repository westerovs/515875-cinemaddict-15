/* eslint-disable */

/*
* ===== главный презентер =====
* */

import dayjs from 'dayjs';
import { getExtraTypeFilms, Films, SortType,  UpdateType, UserAction } from '../utils/const.js';
import { render, removeComponent } from '../utils/render.js'; // удалил метод updateItem

// presenter
import FilmPresenter from './film.js';
// view
import SortView from '../view/sort.js';
import FilmsBoardView from '../view/film-board.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import NoFilmsView from '../view/no-films.js';


export default class MoviesPresenter {
  constructor(mainElement, model) {
    this._mainElement = mainElement;
    this._filmModel = model; // - Переведем получение задач в презентере на модель.

    this._filmsExtra = null;

    // ↓ запоминаем все созданные презентеры ↓
    this._filmPresenters = new Map();
    this._filmPresentersExtra = {
      topRated: new Map(),
      mostCommented: new Map(),
    };

    this._filmsBoardComponent = new FilmsBoardView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();

    this._filmsBoard = null;
    this._filmsListMainContainer = null;
    this._topRatedFilmsList = null;
    this._mostCommentedFilmsList = null;
    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmsCount = Films.FILM_COUNT_PER_STEP;

    // null, т.к теперь они могут быть, а могут не быть
    this._sortComponent = null;
    this._showMoreBtnComponent = null;

    this._handleLoadMoreBtnClick = this._handleLoadMoreBtnClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    //  ------ callbacks ↓
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderBoard();
  }

  _getFilms() {
    const filmCards = this._filmModel.getFilms();
    this._filmsExtra = {
      topRated: getExtraTypeFilms(filmCards).topRated,
      mostCommented: getExtraTypeFilms(filmCards).mostCommented,
    };

    switch (this._currentSortType) {
      case SortType.DEFAULT:
        // console.log('sort DEFAULT')
        return this._filmModel.getFilms();
      case SortType.DATE:
        console.log('sort DATE')
        return filmCards.sort((a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date)));
      case SortType.RATING:
        console.log('sort RATING')
        return filmCards.sort((a, b) => +b.filmInfo.totalRating - +a.filmInfo.totalRating);
    }
  }

  // ----------- RENDERS ↓
  // главный метод для начала работы модуля
  _renderBoard() {
    // если фильмов нет
    if (!this._getFilms().length) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();

    render(this._mainElement, this._filmsBoardComponent);
    this._filmsBoard = this._mainElement.querySelector('.films'); // section films
    this._renderFilmList(true);
  }

  // [1] рендерит 3 секции: main и extra/extra
  _renderFilmList(firstInit) {
    // render центрального контейнера для фильмов
    render(this._filmsBoard, this._filmsListComponent);

    const filmsListMain = this._filmsBoard.querySelector('.films-list--main');
    this._filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

    // _renderAllFilms() { ↓
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, this._renderedFilmsCount));

    this._renderFilms(this._filmsListMainContainer, films);
    this._renderFilmListExtra(firstInit);

    // show more cards
    if (filmsCount > this._renderedFilmsCount) {
      this._renderLoadMoreBtn();
    }
  // }
  }

  // [2]
  _renderFilms(container, films) {
    films.forEach(film => this._renderFilm(container, film));
  }

  // [3]
  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction); // принимает ф-цию update
    filmPresenter.init(film);

    switch (container) {
      case this._filmsListMainContainer: {
        this._filmPresenters.set(film.id, filmPresenter);
        break;
      }
      case this._topRatedFilmsList: {
        this._filmPresentersExtra.topRated.set(film.id, filmPresenter);
        break;
      }
      case this._mostCommentedFilmsList: {
        this._filmPresentersExtra.mostCommented.set(film.id, filmPresenter);
        break;
      }
    }
  }

  // ----------- EXTRA ↓
  _renderFilmListExtra(firstInit = false) {
    if (this._filmsExtra.topRated.some((film) => +film.filmInfo.totalRating !== 0)) {
      if (firstInit) {
        render(this._filmsBoard, new FilmsListExtraView('Top rated', 'rated'));
        this._topRatedFilmsList = this._filmsBoard.querySelector('*[data-extra-type="rated"]');
      }
      this._renderAllExtraFilms('Top rated');
    }
    if (this._filmsExtra.mostCommented.some((film) => film.comments.size !== 0)) {
      if (firstInit) {
        render(this._filmsBoard, new FilmsListExtraView('Most commented', 'commented'));
        this._mostCommentedFilmsList = this._filmsBoard.querySelector('*[data-extra-type="commented"]');
      }
      this._renderAllExtraFilms('Most commented');
    }
  }

  _renderAllExtraFilms(name) {
    switch (name) {
      case 'Top rated':
        this._filmsExtra.topRated.forEach((film) => this._renderFilm(this._topRatedFilmsList, film));
        break;
      case 'Most commented':
        this._filmsExtra.mostCommented.forEach((film) => this._renderFilm(this._mostCommentedFilmsList, film));
        break;
    }
  }
  // ----------- RENDERS ↑


  // ----------- SORT ↓
  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._mainElement, this._sortComponent);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({ resetRenderedFilmCount: true });
    this._renderBoard();
  }
  // ----------- SORT ↑


  // ----------- load more ↓
  _renderLoadMoreBtn() {
    if (this._showMoreBtnComponent !== null) {
      this._showMoreBtnComponent = null;
    }

    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._showMoreBtnComponent.setClickHandler(this._handleLoadMoreBtnClick);

    const filmsListMain = this._filmsBoard.querySelector('.films-list--main');
    render(filmsListMain, this._showMoreBtnComponent);
  }

  _handleLoadMoreBtnClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmsCount, this._renderedFilmsCount + Films.FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderFilms(this._filmsListMainContainer, films);
    this._renderedFilmsCount = newRenderedFilmCount;

    // удаление кнопки
    if (this._renderedFilmsCount >= filmsCount) {
      this._showMoreBtnComponent.getElement().removeEventListener('click', this._handleLoadMoreBtnClick);
      removeComponent(this._showMoreBtnComponent);
    }
  }
  // ----------- load more ↑


  // ----------- ↓ NEW HANDLES ↓
  _handleViewAction(actionType, updateType, updateElement) {
    // console.log(' ')
    // console.log('обрабатывает события на вьюхе, вызывает updateFilm');
    // console.log('actionType: ', actionType)
    // console.log('updateType: ', updateType)
    // console.log('updateElement: ', updateElement)
    // console.log(' ')


    // Описываем все возможные пользовательские действия и все возможные реакции на них
    // когда хотим в презенторе что-то изменить в модели, вызываем updateFilm, куда сообщаем тип и объект обновления ↓
    // тип обновления - это абстрактный эвент
    switch (actionType) {
      case UserAction.UPDATE_FILM_CARD:
        this._filmModel.updateFilm(updateType, updateElement);
        break;
      case UserAction.ADD_NEW_COMMENT:
        console.warn('ADD NEW COMMENT')
        this._filmModel.addComment(updateType, updateElement);
        break;
      case UserAction.DELETE_COMMENT:
        console.warn('DELETE COMMENT')
        this._filmModel.deleteComment(updateType, updateElement);
        break;
    }
  }

  _handleModelEvent(updateType, film) {
    console.log('обработчик наблюдатель изменения модели')
    console.log(updateType)

    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._filmPresenters.get(film.id).init(film);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearBoard({ resetRenderedFilmCount: true, resetSortType: true });
        this._renderBoard();
        break;
    }
  }
  // ----------- ↑ NEW HANDLES ↑


  // ----------- other
  _clearBoard({ resetRenderedFilmCount = false, resetSortType = false } = {}) {
    const filmsCount = this._getFilms().length;

    // очищаем фильмы и экстра-фильмы
    this._filmPresenters.forEach((presenter) => presenter.destroy());
    this._filmPresenters.clear();
    Object.values(this._filmPresentersExtra).forEach((extra) => {
      extra.forEach((presenter) => presenter.destroy());
      extra.clear();
    });

    removeComponent(this._sortComponent);
    removeComponent(this._noFilmsComponent);
    removeComponent(this._showMoreBtnComponent);
    removeComponent(this._filmsBoardComponent);

    // resetRenderedFilmCount - счётчик показанных фильмов ?
    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = Films.SHOW_FILMS;
    } else {
      // На случай, если перерисовка доски вызвана уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    // resetSortType - сбросить тип сортировки
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  // handleTaskChange ↓
  _handleFilmChange(updatedFilm) {
    // Здесь будем вызывать обновление модели

    // this._films = update(this._films, updatedFilm);
    // this._currentSortType = update(this._currentSortType, updatedFilm);
    // this._filmsExtra = getExtraTypeFilms(this._films);

    if (this._filmPresenters.get(updatedFilm.id)) {
      this._filmPresenters.get(updatedFilm.id).init(updatedFilm);
    }
    if (this._filmPresentersExtra.topRated.get(updatedFilm.id)) {
      this._filmPresentersExtra.topRated.get(updatedFilm.id).init(updatedFilm);
    }
    if (this._filmPresentersExtra.mostCommented.get(updatedFilm.id)) {
      this._filmPresentersExtra.mostCommented.get(updatedFilm.id).init(updatedFilm);
    }
  }

  //  ----------- utils и разная херня
  _renderNoFilms() {
    render(this._mainElement, this._noFilmsComponent);
  }
}
