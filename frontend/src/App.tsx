import { Scheduler } from './components/Scheduler';

function App() {
  console.log('App component is rendering');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 bg-green-100 border border-green-400 text-green-700">
        <h1>App is loading successfully!</h1>
        <p>If you can see this, the frontend is working.</p>
      </div>
      <Scheduler />
    </div>
  );
}

export default App;
