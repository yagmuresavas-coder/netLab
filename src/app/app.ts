import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar';
import { LearnViewComponent } from './views/learn-view';
import { QuizViewComponent } from './views/quiz-view';
import { LabsViewComponent } from './views/labs-view';
import { ToolsViewComponent } from './views/tools-view';
import { DockerHubComponent } from './components/docker-hub';
import { NetLabStateService } from './services/netlab-state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    CommonModule,
    MatIconModule,
    NavbarComponent,
    LearnViewComponent,
    QuizViewComponent,
    LabsViewComponent,
    ToolsViewComponent,
    DockerHubComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly state = inject(NetLabStateService);
}

