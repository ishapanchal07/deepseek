import React from 'react'

const PromptBox =() => {
    return (
        <form className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
        <textarea className='outline-none w-full resize-nne overflow-hidden break-words bg-transparent'
        rows={2}
        placeholder='Message Deepseek' required/>
        </form>
    )
}

export default PromptBox