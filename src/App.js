import React, { Component } from 'react'
import './App.css'
import GuessCount from './GuessCount';
import Card from './Card';
import shuffle from 'lodash.shuffle'
import HallofFame, {FAKE_HOF} from './HallOfFame'


const SIDE = 6
const SYMBOLS ='🔫🤗🤩💟🇨🐟🇺🇸🍎🦋👀🌞🛐🏠🌽🇨🇲🙈🇺🐯'

const VISUAL_PAUSE_MSECS = 750

class App extends Component {
  state={
    cards:this.generateCards(),
    currentPair:[],
    guesses:0,
    matchedCardIndices:[],
  }
  generateCards(){
    const result = []
    const size = SIDE * SIDE
    const candidates = shuffle(SYMBOLS)
    while(result.length < size){
      const card = candidates.shift()
      result.push(card, card)
    }
    return shuffle(result)
  }
  handleCardClick=index=>{
    console.log(index)
   const {currentPair} = this.state
   if(currentPair.length===2){
     return
   }
   if(currentPair.length===0){
     this.setState({currentPair:[index]})
     return
   }
   this.handleNewPairClosedBy(index)
  //  console.log(index)
  }
  getFeedbackForCard(index){
    const {currentPair, matchedCardIndices}=this.state
    const indexMatched=matchedCardIndices.includes(index)

    if(currentPair.length<2){
      return indexMatched || index === currentPair[0] ? 'visible':'hidden'
    }
    if (currentPair.includes(index)){
      return indexMatched ? 'justMatched':'justMismatched'
    }
    return indexMatched ? 'visible' : 'hidden'
  }
  handleNewPairClosedBy(index){
   

    const{cards,currentPair,guesses,matchedCardIndices}=this.state
      const newPair = [currentPair[0],index]
      const newGuesses = guesses+1
      const matched = cards[newPair[0]] === cards[newPair[1]]
      this.setState({currentPair:newPair,guesses:newGuesses})
      if(matched){
        this.setState({matchedCardIndices:[...matchedCardIndices, ...newPair]})
      }
      setTimeout(()=>this.setState({currentPair:[]}),VISUAL_PAUSE_MSECS)

  }
  render() {
    const {cards,guesses,matchedCardIndices}=this.state
    const won = matchedCardIndices.length=== cards.length
    return (
      <div className="memory">
        <GuessCount guesses={guesses}/>
        {cards.map((card, index)=>(
        <Card 
          card={card}
          feedback={this.getFeedbackForCard(index)}
          // feedback="visible"
          key={index}
          onClick={this.handleCardClick}
          index={index}
        />
        ))}
        {won && <HallofFame entries ={FAKE_HOF}/>}
        
      </div>

     
    )

  }
}

export default App