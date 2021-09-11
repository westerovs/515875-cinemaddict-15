/*
# главный презентер

##Описание методов:

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

---
---------------------------- ↓ краеугольный камень стык MVP ↓
Эти два колбека нужны, чтобы построить взаимодействие от view до модели, через презентер

_handleViewAction(actionType, updateType, update) {
  это колбек, будет передан view
  #####  обрабатывает события на вьюхе, он будет вызывать updateFilm
    - actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    - updateType - жучок тип изменений, нужно чтобы понять, что после нужно обновить
    - update - обновленные данные


_handleModelEvent(updateType, data) {
  это колбек, будет передан модели и он станет наблюдателем за моделью.
  когда в модели будет что-то происходить, она вызовет этот колбек
  и мы в презенторе решим что делать
  обработчик-наблюдатель который будет реагировать на изменения модели

  ##### В зависимости от типа изменений решаем, что делать:
    - обновить часть списка (например, когда поменялось описание)
    - обновить список (например, когда задача ушла в архив)
    - обновить всю доску (например, при переключении фильтра)
---------------------------- ↑ краеугольный камень стык MVP ↑

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