const formatGlobalDate= (date :string)=>{
  return new Date(date).toLocaleString('en-GB')
}

export default formatGlobalDate