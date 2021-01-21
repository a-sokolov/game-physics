import { Game } from './game'
import './styles/styles.css'

window.onload = () => {
  const game = new Game()
  game.run()
}