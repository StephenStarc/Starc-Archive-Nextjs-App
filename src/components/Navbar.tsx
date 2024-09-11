import { User , Search} from "lucide-react"
import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <header className="border-b">
    <div className="container mx-auto px-2 py-2 flex justify-between items-center">
      <a href="/">
       <img src='/sitelogo.png' alt="Logo" width={150}></img>
      </a>
      <nav>
        <ul className="flex space-x-4">
        <li>
            <Link to="/search" className="flex items-center">
              <Search className="mr-1 h-5 w-5"/>
              Search
            </Link>
          </li>
          <li>
            <Link to="/login" className="flex items-center">
              <User className="mr-1 h-5 w-5" />
              Login
            </Link>
          </li>
          
        </ul>
      </nav>
    </div>
  </header>
  )
}