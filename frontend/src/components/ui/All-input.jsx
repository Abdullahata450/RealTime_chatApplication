import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputWithEmailLabel({value="" , onChange = () => {}}) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter Email" onChange={onChange} value={value} required/>
    </div>
  )

}

export function InputWithNameLabel({value="" , onChange = () => {}}){
  return (
    <div className="grid w-full max-w-sm items-center">
      <Label htmlFor="name">Fullname</Label>
      <Input type="text" id="name" placeholder="Enter Name" onChange={onChange} value={value} required/>
    </div>
  )
}

export function InputWithPasswrodLabel({value="" , onChange = () => {}}){
  return (
    <div className="grid w-full max-w-sm items-center">
      <Label htmlFor="password">Password</Label>
      <Input type="password" id="password" placeholder="Enter Password" onChange={onChange} value={value} required />
    </div>
  )
}

export function Inputchat({ value = "", onChange = () => {} }) {
  return (
    <div className="grid w-full max-w-sm items-center">
      <Input 
        type="text" 
        id="message" 
        placeholder="Enter Message" 
        onChange={onChange} 
        value={value} 
        required
        className="chat-input"
      />
    </div>
  );
}

