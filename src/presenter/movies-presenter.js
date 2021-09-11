/* eslint-disable */

/*
 ===== главный презентер =====

_getFilms()
  - В методе получения задач из модели опишем условие, чтобы учитывалась выбранная сортировка.
  Теперь, если какой-то метод в нашем презентере захочет получить список задач из модели,
  он получит их в нужном порядке
  позволяет проводить манипуляции с задачами, какие нам нужны в презенторе в одном месте
  Переведем получение задач в презентере на модель.
  Теперь моки напрямую в презентере не используются, только модель


_renderFilms()
   теперь он получает не диапазон, а сразу массив задач, которые нужно отрендерить,
   потому что мы больше не получаем в init моки и больше неоткуда брать задачи по диапазону
  WIP: отказавшись от моков "сломали" обновление данных, оно заработает снова после настройки датабиндинга с моделью


_handleFilmChange(updatedFilm) {
  Здесь будем вызывать обновление модели


_handleModelEvent(updateType, data) {
  обработчик-наблюдатель который будет реагировать на изменения модели
  В зависимости от типа изменений решаем, что делать:
    - обновить часть списка (например, когда поменялось описание)
    - обновить список (например, когда задача ушла в архив)
    - обновить всю доску (например, при переключении фильтра)


_handleViewAction(actionType, updateType, update) {
  обрабатывает события на вьюхе, он будет вызывать updateFilm
    actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    updateType - жучок тип изменений, нужно чтобы понять, что после нужно обновить
    update - обновленные данные


_clearBoard({ resetRenderedTaskCount = false, resetSortType = false } = {}) {
  для очистки доски: он умеет очищать список
  и (по необходимости) сбрасывать количество показанных задач или сортировку



7.1.5
renderBoard объединим с _renderTaskList
и тоже научим отрисовывать не просто TASK_COUNT_PER_STEP задач, а столько - сколько было до перерисовки

- В функции remove поддержим ситуацию, когда пытаемся удалить null, то есть отсутствующий компонент

- Шаблон сортировки научим учитывать выбранную и отмечать активный пункт.
Теперь это возможно, потому что компонент сортировки перерисовывается с доской
*/

import dayjs from 'dayjs';
import { getExtraTypeFilms, Films, SortType,  UpdateType, UserAction } from '../utils/const.js';
import { render, removeComponent } from '../utils/render.js'; // удалил метод updateItem

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
    this._renderedFilmsCount = Films.FILMS_LOAD_MORE;

    this._sortComponent = null;
    this._showMoreBtnComponent = null;

    this._handleLoadMoreBtnClick = this._handleLoadMoreBtnClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    //  ------
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
  }

  init() {
    // убрал получение моков
    this._renderBoard();
    this._renderFilmsList();
  }

  _getFilms() {
    const filmCards = this._filmModel.getFilms();
    this._filmsExtra = {
      topRated: getExtraTypeFilms(filmCards).topRated,
      mostCommented: getExtraTypeFilms(filmCards).mostCommented,
    };

    switch (this._currentSortType) {
      case SortType.DEFAULT:
        console.log('sort DEFAULT')
        return this._filmModel.getFilms();
      case SortType.DATE:
        console.log('sort DATE')
        return filmCards.sort((a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date)));
      case SortType.RATING:
        console.log('sort RATING')
        return filmCards.sort((a, b) => +b.filmInfo.totalRating - +a.filmInfo.totalRating);
    }
  }

  // главный метод для начала работы модуля
  _renderBoard() {
    // если фильмов нет
    if (!this._getFilms().length) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();

    render(this._mainElement, this._filmsBoardComponent);
    this._filmsBoard = this._mainElement.querySelector('.films');
  }

  _renderNoFilms() {
    render(this._mainElement, this._noFilmsComponent);
  }

  // sort ↓
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
    // this._clearBoard({ resetRenderedTaskCount: true });
    this._renderAllFilms(); // this._renderBoard(); // ?
  }

  // [1]
  _renderFilmsList() {
    // render центрального контейнера для фильмов
    render(this._filmsBoard, this._filmsListComponent);

    const filmsListMain = this._filmsBoard.querySelector('.films-list--main');
    this._filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

    this._renderAllFilms(true);
  }

  // [2]
  _renderAllFilms(firstInit = false) {
    // аналог _renderBoard в taskmanagere
    // Теперь, когда _renderBoard рендерит доску не только на старте,
    // но и по ходу работы приложения, нужно заменить
    // константу TASK_COUNT_PER_STEP на свойство _renderedTaskCount,
    // чтобы в случае перерисовки сохранить N-показанных карточек
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, this._renderedFilmsCount));

    this._renderFilms(this._filmsListMainContainer, films);
    this._renderExtraFilmsContainer(firstInit);

    // show more cards
    if (filmsCount > Films.FILMS_LOAD_MORE) {
      this._renderLoadMoreBtn();
    }
  }

  // [3]
  // Упростим метод _renderTasks: теперь он получает не диапазон,
  // а сразу массив задач, которые нужно отрендерить, потому что мы отказались от свойства this.films (моков)
  // и больше неоткуда брать задачи по диапазону
  _renderFilms(container, films) {
    films.forEach(film => this._renderFilmPresenter(container, film));
  }

  // [4]
  _renderFilmPresenter(container, film) {
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

  _renderExtraFilmsContainer(firstInit = false) {
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
        this._filmsExtra.topRated.forEach((film) => this._renderFilmPresenter(this._topRatedFilmsList, film));
        break;
      case 'Most commented':
        this._filmsExtra.mostCommented.forEach((film) => this._renderFilmPresenter(this._mostCommentedFilmsList, film));
        break;
    }
  }

  // load more ↓
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
    const newRenderedFilmCount = Math.min(filmsCount, this._renderedFilmsCount + Films.FILMS_LOAD_MORE);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderFilms(this._filmsListMainContainer, films);
    this._renderedFilmsCount = newRenderedFilmCount;

    // удаление кнопки
    if (this._renderedFilmsCount >= filmsCount) {
      this._showMoreBtnComponent.getElement().removeEventListener('click', this._handleLoadMoreBtnClick);
      removeComponent(this._showMoreBtnComponent);
    }
  }

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

  // ----------- new events
  _handleViewAction(actionType, updateType, update) {
    console.log('обрабатывает события на вьюхе, вызывает updateFilm');

    // Описываем все возможные пользовательские действия и все возможные реакции на них
    switch (actionType) {
      case UserAction.UPDATE_FILM_CARD:
        this._filmModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_NEW_COMMENT:
        this._filmModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    console.log('обработчик наблюдатель изменения модели')

    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._filmPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearBoard();
        this._renderBoard(); // ?
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearBoard({ resetRenderedTaskCount: true, resetSortType: true });
        this._renderBoard(); // ?
        break;
    }
  }

  // -------------------------
  _clearBoard({ resetRenderedTaskCount = false, resetSortType = false } = {}) {
    // очищаем фильмы и экстра-фильмы
    this._filmPresenters.forEach((presenter) => presenter.destroy());
    this._filmPresenters.clear();
    Object.values(this._filmPresentersExtra).forEach((extra) => {
      extra.forEach((presenter) => presenter._destroy());
      extra.clear();
    });

    // this._renderedFilmsCount = Films.FILMS_LOAD_MORE; // ? раньше было в _clearList

    removeComponent(this._sortComponent);
    removeComponent(this._noFilmsComponent);
    removeComponent(this._showMoreBtnComponent);

    const filmsCount = this._getFilms().length;

    if (resetRenderedTaskCount) {
      this._renderedFilmsCount = Films.SHOW_FILMS;
    } else {
      // На случай, если перерисовка доски вызвана уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
