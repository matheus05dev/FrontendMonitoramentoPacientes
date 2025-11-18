import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
  ],
  templateUrl: './toolbar-sidenav.html',
  styleUrls: ['./toolbar-sidenav.css'],
})
export class ToolbarSidenav implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatSidenav;
  isOpen = false;
  isDarkTheme = false;

  constructor(private router: Router) {}

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      this.close();
    }
  };

  toggle() {
    this.isOpen = !this.isOpen;
  }
  open() {
    this.isOpen = true;
  }
  close() {
    this.isOpen = false;
  }

  toggleTheme() {
    // dark mode removed: no-op to prevent toggling theme
    this.isDarkTheme = true;
  }

  logout() {
    // TODO: Add proper logout logic
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    document.addEventListener('keydown', this._onKeydown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this._onKeydown);
  }
}
