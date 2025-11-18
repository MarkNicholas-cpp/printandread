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
    console.log('✅ App component initialized');
    
    // Scroll to top on route change with slower animation
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        console.log('📍 Navigation ended, scrolling to top');
        // Use a slower, smoother scroll
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    
    // Log initial route
    console.log('📍 Initial route:', this.router.url);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
