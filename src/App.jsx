import { useState } from 'react'
import './App.css'
import axios from 'axios'

function stripMarkdown(text) {
  return text.replace(/[*_`#/]/g, '');
}

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [dispalyQuestion, setDisplayQuestion] = useState('')
  const [showWelcome, setShowWelcome] = useState(true)

  async function generateAnswer() {

    setShowWelcome(false)
    setDisplayQuestion(question)
    setQuestion('')
    setAnswer('Thinking...')

    const API_KEY = 'YOUR_API_KEY'

    try {

      const response = await axios({
        method: "POST",
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        data: {
          "contents": [
            {
              "parts": [
                {
                  "text": question
                }
              ]
            }
          ]
        }
      })

      const text = response.data.candidates[0].content.parts[0].text
      setAnswer(stripMarkdown(text))

    }
    catch (error) {
      setAnswer("Something went wrong. Please try again :(");
      console.error(error);
    }
  }

  return (

    <div className='min-h-[100vh] w-full flex items-center justify-center flex-col bg-[#1C1917] text-white'>

      <h1 className='font-bold text-4xl max-lg:text-3xl select-none text-[#FACC15]'>
        Abacus AI
      </h1>

      <div
        className={`m-5 rounded-2xl h-[70vh] lg:w-[62vw] w-[95vw] flex flex-col overflow-y-scroll bg-[#292524] border border-[#3F3A36] shadow-[0_0_30px_rgba(0,0,0,0.5)] ${showWelcome ? 'justify-center items-center' : 'justify-start'}`}>

        {showWelcome && (
          <div className='flex flex-col text-center gap-4 p-6 max-lg:w-[320px] rounded-xl bg-[#1C1917] border border-[#3F3A36]'>
            <h2 className='font-semibold text-2xl max-lg:text-lg text-[#FACC15]'>
              Welcome to Abacus AI! 👋
            </h2>
            <p className='text-gray-300 max-lg:text-sm'>
              Your premium AI assistant for knowledge, solutions, and insight.
            </p>

            <div className='grid lg:grid-cols-2 gap-3 max-lg:text-sm'>
              {['💡 General knowledge', '🔧 Technical questions', '📝 Writing assistance', '🤔 Problem solving'].map((t, i) => (
                <div
                  key={i}
                  className='py-3 rounded-lg text-gray-200 bg-[#292524] border border-[#3F3A36] hover:border-[#FACC15]/60 hover:shadow-[0_0_15px_rgba(250,204,21,0.25)] transition'>
                  {t}
                </div>
              ))}
            </div>

            <p className='text-gray-400 max-lg:text-sm'>
              Type below and press <span className='text-[#FACC15] font-medium'>Enter</span> to send.
            </p>
          </div>
        )}

        {!showWelcome && (
          <>
            {dispalyQuestion && (
              <div className='self-end m-5 px-3 py-2 max-lg:text-sm rounded-l-2xl rounded-t-2xl text-black bg-[#FACC15]'>
                <p>{dispalyQuestion}</p>
              </div>
            )}

            {answer && (
              <div className='self-start m-5 max-lg:my-0 mb-5 max-lg:mb-5 px-3 py-3 max-lg:text-sm rounded-r-2xl rounded-t-2xl text-gray-200 bg-[#3F3A36] border border-[#4B4743]'>
                <pre className='whitespace-pre-wrap'>{answer}</pre>
              </div>
            )}
          </>
        )}
      </div>

      <div className='rounded-2xl lg:w-[62vw] w-[95vw] flex flex-row h-[10vh] items-centerbg-[#292524] border border-[#3F3A36] shadow-[0_0_20px_rgba(0,0,0,0.4)]'>

        <input
          value={question}
          placeholder='Ask Something...'
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && question.trim()) { generateAnswer(); } }}
          className='bg-[#1C1917] text-gray-200 placeholder:text-gray-500 border border-[#3F3A36] focus:border-[#FACC15]/70 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 p-3 w-full m-3 rounded-xl' />

        <button
          onClick={generateAnswer}
          disabled={!question.trim()}
          className='m-3 px-6 py-3 rounded-xl font-medium bg-[#FACC15] text-black hover:bg-[#EAB308] disabled:opacity-40 disabled:cursor-not-allowed transition'>
          Send
        </button>
      </div>

    </div>
  )
}

export default App


