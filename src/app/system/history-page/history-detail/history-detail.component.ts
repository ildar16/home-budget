import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {EventService} from "../../shared/services/events.service";
import {CategoriesService} from "../../shared/services/categories.service";
import {WFMEvent} from "../../shared/models/event.models";
import {Category} from "../../shared/models/category.model";
import {Subscription} from "rxjs/Rx";

@Component({
    selector: 'qwerty-history-detail',
    templateUrl: './history-detail.component.html',
    styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

    event: WFMEvent;
    category: Category;

    isLoaded = false;
    s1: Subscription;

    constructor(private route: ActivatedRoute, private eventService: EventService, private categoriesService: CategoriesService) {}

    ngOnInit() {
        this.s1 = this.route.params
            .mergeMap((params: Params) => this.eventService.getEventById(params['id']))
            .mergeMap((event: WFMEvent) => {
                this.event = event;
                return this.categoriesService.getCategoryById(event.category)
            })
            .subscribe((category: Category) => {
                this.category = category;
                this.isLoaded = true;
            });
    }

    ngOnDestroy() {
        if (this.s1) {
            this.s1.unsubscribe();
        }
    }

}
