import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NavigationComponent } from './components/navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('printandread');
  private routerSubscription?: Subscription;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Scroll to top on route change with slower animation
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Use a slower, smoother scroll
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
