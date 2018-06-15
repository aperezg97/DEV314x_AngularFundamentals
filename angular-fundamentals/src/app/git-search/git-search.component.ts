import { Component, OnInit } from '@angular/core';
import { GitSearchService } from '../git-search.service';
import { GitSearch } from '../git-search';
import { GitUsers } from '../git-users';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AdvancedSearchModel } from '../advanced-search-model'

@Component({
  selector: 'app-git-search',
  templateUrl: './git-search.component.html',
  styleUrls: ['./git-search.component.css']
})
export class GitSearchComponent implements OnInit {
  searchResults: GitSearch;
  searchQuery: string;
  title: string;
  displayQuery: string;
  currentPage: number;

  constructor(private GitSearchService: GitSearchService,
              private route: ActivatedRoute, private router: Router ) { }

  model = new AdvancedSearchModel('', '', '', null, null, '');
  modelKeys = Object.keys(this.model);

  ngOnInit() {
    /*
    this.GitSearchService.gitSearch('angular js',1).then( (response) => {
      this.searchResults = <GitSearch> response;
      // alert('Total Libraries Found:' + (<GitSearch> response).total_count);
    }, (error) => {
      alert('Error Libraries: ' + error.statusText);
    });

    this.GitSearchService.gitUserSearch('tom',1).then( (response) => {
      // alert('Total Users Found:' + (<GitUsers> response).total_count);
    }, (error) => {
      alert('Error Users: ' + error.statusText);
    });
    */
    this.route.data.subscribe( (result) => {
      this.title = result.title;
    });
    this.route.paramMap.subscribe( (params: ParamMap) => {
      this.searchQuery = params.get('query');
      this.displayQuery = params.get('query');
      this.currentPage = parseInt(params.get('page'), 10); // Radix parameter = 10 10->decimal;
      this.gitSearch();
    });
  }

  gitSearch = () => {
    this.GitSearchService.gitSearch(this.searchQuery, this.currentPage).then( (response) => {
      this.searchResults = <GitSearch> response;
      // alert('Total Libraries Found:' + (<GitSearch> response).total_count);
    }, (error) => {
      alert('Error Libraries: ' + error.statusText);
    });
  }
  sendQuery = () => {
    /*this.searchResults = null;
    this.router.navigate(['/search/' + this.searchQuery + '/' + this.currentPage]);*/
    this.searchResults = null;
    let search : string = this.model.q;
    let params : string = "";
    this.modelKeys.forEach(  (elem) => {
        if (elem === 'q') {
            return false;
        }
        if (this.model[elem]) {
          params += '&' + elem + ':' + this.model[elem];
        }
    })
    this.searchQuery = search;
    if (params !== '') {
        this.searchQuery = search + '&' + params;
    }
    this.displayQuery = this.searchQuery;
    this.gitSearch();
  }

  changePage = (direction: number) => {
    this.currentPage += direction;
    this.sendQuery();
  }
}
