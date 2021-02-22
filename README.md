# The Last Ninja Game

Короче. Это попытка разобраться с игровыми механиками, такими как:
- Коллизии
- Анимация персонажей
- Построение уровней
- Камера, которая следит за игроком
- Параллаксом
- ИИ врагов
- и т.д.

## Tips&Tricks
Здесь описаны "механики", с которыми удалось как-то разобраться.

### Как работают коллизии
Определено 15 типов взаимодействий объекта с элементами уровня.
Все они исходят из того, что представляя каждую сторону в виде бита, мы получаем
возможность оформить свой уникальный код, переведя его из `binary` в `decimal` систему.

Вся логика, определяющая куда "выталкивать" объект в зависимости от типа, определена в
классе `src/world/collider.js`, а сам вызов в функции `collideObject` класса `src/world/collide-object.js`.

#### Каждая сторона платформы определяется своим битом

    0 0 0 0 = l b r t (left bottom right top)

    0000 = 0  tile 0:    0    tile 1:   1     tile 2:    0    tile 15:    1
    0001 = 1           0   0          0   0            0   1            1   1
    0010 = 2             0              0                0                1
    1111 = 15        No walls     Wall on top      Wall on Right      four walls

#### Сейчас поддерживается 15 типов побитовых масок

    0000 00 - no walls               ничего не делаем
    0001 01 - top wall               можно встать на платформу сверху
    0010 02 - right wall             упираемся при движении | <-
    0011 03 - right-top wall         
    0100 04 - bottom wall            упираемся при прыжке в нижную часть платформы
    0101 05 - bottom-top wall        
    0110 06 - bottom-right wall      
    0111 07 - bottom-right-top wall
    1000 08 - left wall              упираемся при движении -> |
    1001 09 - left-top wall
    1010 10 - left-right wall
    1011 11 - left-right-top wall
    1100 12 - left-bottom wall
    1101 13 - left-bottom-top wall
    1110 14 - left-bottom-right wall
    1111 15 - all walls

#### Расположение маски на уровне

Сейчас работает следующий принцип задания масок коллизий на уровне.

- Определяем размер базового спрайта, например 16x16
- Говорим, что экран будет размером 64x32 (размеры должны быть кратны спрайту)
- Представляем размер в виде массива - 4 столбца * 2 строки, где `0`, условно,
  пустое место, а `1` там где будет рисоваться платформа (например, изображение блока из кирпича)
```javascript
const map = [0, 0, 0, 0,
             1, 1, 1, 1]
```

Теперь, определяем нужную маску там, где это необходимо.
Например, мы хотим, чтобы игрок "ходил" по блокам из кирпича -- это может быть маска `15` (все стороны) 
```javascript
const collisionMap = [0 , 0 , 0 , 0 ,
                      15, 15, 15, 15]
```

Теперь, когда объект передвигается по уровню, зная размер хитбокса, базовый размер спрайта,
размер экрана и т.д., мы можем вычислить его положение в нашей сетке, т.е. индекс массива.

Далее, зная маску коллизии, координаты объекта и платформы, вычисляем, куда можно, а куда нельзя 
двигаться и "выталкиваем" объект в противоположную сторону от той или иной стороны платформы.

Можно представить это в следующем виде:
- 0 - пустое пространство
- 1 - платформа, через которую нельзя пройти сверху
- x - игрок, на которого действует гравитация и каждый кадр к ускорению по Y координате + 2 (условно).
таким образом наш объект "падает"
```
    1й шаг         2й шаг         3 шаг          4 шаг          5 шаг          6 шаг

    0 0 0 0 0 0 0  0 0 0 0 0 0 0  0 0 0 0 0 0 0  0 0 0 0 0 0 0  0 0 0 0 0 0 0  0 0 0 0 0 0 0
    0 0 x 0 0 0 0  0 0 0 0 0 0 0  0 0 0 0 0 0 0  0 0 0 0 0 0 0  0 0 0 0 0 0 0  0 0 0 0 0 0 0
    0 0 0 0 0 0 0  0 0 x 0 0 0 0  0 0 0 0 0 0 0  0 0 x 0 0 0 0  0 0 0 0 0 0 0  0 0 x 0 0 0 0
    1 1 1 1 1 1 1  1 1 1 1 1 1 1  1 1 x 1 1 1 1  1 1 1 1 1 1 1  1 1 x 1 1 1 1  1 1 1 1 1 1 1
```
  
Т.е. как только объект пересекается своими координатами с точкой, где располагается коллизия,
запускаем проверку. В нашем случае это маска `1`, которая говорит о том, что мы должны "выталкивать"
объект вверх (визуально, это будет "встать на платформу").

В `1, 2 и 3 шаге`, объект падает с учетом гравитации, а коллизия, вычисляя, что:
```javascript
const { y, oldY, height } = object
if (y + height > platform.y && oldY + height <= platform.y) {
  // Текущая координата объекта вылезла ниже платфомы, а старая координата на уровне или выше
  object.y = platform.y - 0.01 - height // выталкиваем объект, чтобы он оказался над платформой
  object.velocityY = 0 // зануляем ускорение по Y координате
}
```

В `4 шаге` наш объект оказывается над платформой.

Далее, на `5 шаге` снова действует гравитация, падение вниз, коллизия, выталкивание `6 шаг`.

Все остальные типы работают по принципу описанному выше.

### Как работает анимация персонажа и их связь к тому или иному действию (например, атака)
### Принцип работы общей камеры игры
Тут можно посмотреть какие типы камер бывают:
- https://www.youtube.com/watch?v=l9G6MNhfV7M
- https://www.youtube.com/watch?v=pdvCO97jOQk

Я выбрал тип `camera trap`, т.к. для платформеров она более оптимальна.
Реализация лежит здесь `src/main-camera.js`.

В 2х словах: задается размер экрана, общий размер уровня и позиция "рамки", выходя за границы оной, игрок
"двигает" камеру, т.е. задает `x` и `y` координаты.
И при отрисовки всех картинок мы корректируем их позиции относительно неё.

## Bugs
Если бежать до конца карты, и не отпуская стрелки вправо, уперевшись в край карты прыгнуть,
то почему-то отрабатывает коллизия, которая находится в самом начале и игрок "встает на платформу
в воздухе"

## TODO
- Разобраться как хранить анимацию и карту уровня со списком коллизий
  
    https://www.youtube.com/watch?v=r6F7WafrvTE&t=0s - создание графики
    https://www.youtube.com/watch?v=PmZ38JHEAys&t=0s - тайловая карта
  
- Разобраться как можно считать коллизии если хит-бокс объекта больше базового размера спрайта
- Заливка фона "куском" картинки, например залить все небо карты куском из `./assets/level01/sky.png`

## Links
https://m.habr.com/ru/company/pixonic/blog/428892/ - гайд по созданию игрового ИИ
https://rvros.itch.io/animated-pixel-hero - тайлы персонажа
https://thorbjorn.itch.io/tiled - приложение, где можно загружать тайловый карты и формировать JSON

https://ansimuz.itch.io/magic-cliffs-environment - уровень 01
https://edermunizz.itch.io/free-pixel-art-forest - уровень 02 (подуровень)

https://oco.itch.io/ - еще какие-то тайлы
https://www.spriters-resource.com/ - бесплатные спрайты
https://itch.io/game-assets/free - еще беплатные тайлы
https://vectorjs.org/ - библиотека Vector
https://suvitruf.ru/2019/03/13/4305/a-brief-introduction-to-lerp/ - линейная интерполяция LERP
