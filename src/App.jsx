import Board from "./board/Board";
import SocialShare from "./board/SocialShare.jsx";

function App() {
  return (
    <div className="grid grid-cols-12">
      <header className="col-span-12 bg-slate-500 py-2 px-4 text-3xl font-bold text-emerald-500">
        Photo memory
      </header>
      <div className="col-span-12 p-2 sm:col-span-10">
        <Board />
      </div>
      <div className="col-span-12 bg-red-500 p-2 sm:col-span-2">
        Advertising
      </div>
      <footer className="col-span-12 bg-yellow-500 p-2">
        <div className="flex justify-around">
          <div>Created by Saurabh</div>
          <div>
            <SocialShare />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
