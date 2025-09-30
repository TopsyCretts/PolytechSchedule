import './Button.scss'
import clsx from 'clsx'

interface ButtonProps{
  className?:string;
}

const Button = ({className}:ButtonProps) =>{
  
  return (
    <div
      className={clsx(className, "button")}
    >
      Button
    </div>
  )
}

export default Button