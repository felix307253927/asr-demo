import React, { PureComponent } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import newTask from './pages/newTask';
import doTask from './pages/doTask';

class App extends PureComponent {

  componentWillMount() {
    global.task = ipcRenderer.sendSync('get-task')
  }

  componentDidMount() {
    ipcRenderer.on('open-xlsx', (e, task) => {
      if (!task) {
        ipcRenderer.send('open-xlsx')
      } else {
        global.task = task;
        this.history && this.history.push('/do-task')
      }
    })
  }
  render() {
    return (
      <HashRouter>
        <Route render={({ location, history }) => {
          this.history = history
          if (global.task && location.pathname === '/index') {
            history.replace('/do-task')
            return null
          }
          return (
            <Switch>
              <Route path="/index" component={newTask} />
              <Route path="/do-task" component={doTask} />
              <Redirect from="*" to="/index" />
            </Switch>
          )
        }} />
      </HashRouter>
    );
  }
}

export default App;
