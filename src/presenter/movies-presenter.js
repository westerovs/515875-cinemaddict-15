/*
* ===== главный презентер =====
* */

import { getExtraTypeFilms, Films, UpdateType, UserAction } from '../utils/const.js';
import { render, removeComponent } from '../utils/render.js';
import { SortType, sortDateDown, sortRatingDown } from '../utils/sort.js';
import { FilterType, filterCallBack } from '../utils/filter.js';

// presenter
import FilmPresenter from './film-presenter.js';
// view
import SortView from '../view/board/sort.js';
import FilmsBoardView from '../view/board/film-board.js';
import FilmsListView from '../view/board/films-list.js';
import FilmsListExtraView from '../view/board/films-list-extra.js';
import ShowMoreBtnView from '../view/board/show-more-btn.js';
import NoFilmsView from '../view/board/no-films.js';


export default class MoviesPresenter {
  constructor(mainElement, model, filterModel) {
    this._mainElement = mainElement;
    this._moviesModel = model;
    this._filterModel = filterModel;

    this._filmsBoardComponent = new FilmsBoardView();
    this._filmsListComponent  = new FilmsListView();
    this._noFilmsComponent    = null;

    // ↓ запоминаем все созданные презентеры ↓
    this._filmPresenters = new Map();
    this._filmPresentersExtra = {
      topRated: new Map(),
      mostCommented: new Map(),
    };

    this._filterType = FilterType.ALL;
    this._filmsBoard = null;
    this._filmsListMainContainer = null;
    this._filmsExtra = null;
    this._topRatedFilmsList = null;
    this._mostCommentedFilmsList = null;
    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmsCount = Films.FILM_COUNT_PER_STEP;
    this._sortComponent = null;
    this._showMoreBtnComponent = null;

    this._handleLoadMoreBtnClick = this._handleLoadMoreBtnClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    //  ------ callbacks MVP ↓
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderBoard();
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter(); // (ALL) текущий тип фильтра
    const films = this._moviesModel.getFilms(); // набор фильмов из модели фильмов
    const filteredFilms = filterCallBack[this._filterType](films); // возвращает отфильтрованные фильмы
    // console.warn(this._filterType)
    // console.warn(films)
    // console.warn(filteredFilms)

    this._filmsExtra = {
      topRated: getExtraTypeFilms(films).topRated,
      mostCommented: getExtraTypeFilms(films).mostCommented,
    };

    // сортируем отфильтрованный результат
    switch (this._currentSortType) {
      // case SortType.DEFAULT:
      //   return filteredFilms;
      case SortType.DATE:
        return filteredFilms.slice().sort(sortDateDown);
      case SortType.RATING:
        return filteredFilms.slice().sort(sortRatingDown);
    }

    return filteredFilms;
  }

  // ----------- RENDERS ↓
  // главный метод для начала работы модуля
  _renderBoard() {
    // если фильмов нет
    if (!this._getFilms().length) {
      this._renderNoFilms();
      return;
    }

    this._renderSortList();

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

    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, this._renderedFilmsCount));

    this._renderFilms(this._filmsListMainContainer, films);
    this._renderFilmListExtra(firstInit);

    // show more cards
    if (filmsCount > this._renderedFilmsCount) {
      this._renderLoadMoreBtn();
    }
  }

  // [2]
  _renderFilms(container, films) {
    films.forEach((film) => this._renderFilm(container, film));
  }

  // [3]
  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._filterModel.getFilter()); // принимает ф-цию update
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
  _renderSortList() {
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
    // Описываем все возможные пользовательские действия и все возможные реакции на них
    // когда хотим в презенторе что-то изменить в модели, вызываем updateFilm, куда сообщаем тип и объект обновления ↓
    // тип обновления - это абстрактный эвент
    switch (actionType) {
      case UserAction.UPDATE_FILM_CARD:
        this._moviesModel.updateFilm(updateType, updateElement);
        break;
      case UserAction.ADD_NEW_COMMENT:
        this._moviesModel.addComment(updateType, updateElement);
        break;
      case UserAction.DELETE_COMMENT:
        this._moviesModel.deleteComment(updateType, updateElement);
        break;
    }
  }

  _handleModelEvent(updateType, updatedFilm) {
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        if (this._filmPresenters.get(updatedFilm.id)) {
          this._filmPresenters.get(updatedFilm.id).init(updatedFilm);
        }
        if (this._filmPresentersExtra.topRated.get(updatedFilm.id)) {
          this._filmPresentersExtra.topRated.get(updatedFilm.id).init(updatedFilm);
        }
        if (this._filmPresentersExtra.mostCommented.get(updatedFilm.id)) {
          this._filmPresentersExtra.mostCommented.get(updatedFilm.id).init(updatedFilm);
        }
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
    removeComponent(this._showMoreBtnComponent);
    removeComponent(this._filmsBoardComponent);

    if (this._noFilmsComponent) {
      removeComponent(this._noFilmsComponent);
    }

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

  _renderNoFilms() {
    this._noFilmsComponent = new NoFilmsView(this._filterType);
    render(this._mainElement, this._noFilmsComponent);
  }
}
