import { Scheduler } from './components/Scheduler';

function App() {
  console.log('App component rendering...');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Scheduler />
    </div>
  );
}

export default App;
