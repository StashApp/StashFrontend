import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Headers, RequestOptions } from '@angular/http';

import { StashService } from '../../core/stash.service';
import { ArtooService } from '../../core/artoo.service';

import { Scene } from '../../shared/models/scene.model';
import { Performer } from '../../shared/models/performer.model';
import { Tag } from '../../shared/models/tag.model';
import { Studio } from '../../shared/models/studio.model';
import { Gallery } from '../../shared/models/gallery.model';

@Component({
  selector: 'app-performer-form',
  templateUrl: './performer-form.component.html',
  styleUrls: ['./performer-form.component.css']
})
export class PerformerFormComponent implements OnInit, OnDestroy {
  name: string;
  favorite: boolean;
  aliases: string;
  country: string;
  birthdate: string;
  ethnicity: string;
  eye_color: string;
  height: string;
  measurements: string;
  fake_tits: string;
  career_length: string;
  tattoos: string;
  piercings: string;
  url: string;
  twitter: string;
  instagram: string;
  image: string;

  loading = true;
  imagePreview: string;
  image_path: string;
  ethnicityOptions: string[] = ['white', 'black', 'asian', 'hispanic'];

  constructor(
    private route: ActivatedRoute,
    private stashService: StashService,
    private artooService: ArtooService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPerformer();
  }

  ngOnDestroy() {}

  async getPerformer() {
    const id = parseInt(this.route.snapshot.params['id'], 10);
    if (!!id === false) {
      console.log('new performer');
      this.loading = false;
      return;
    }

    const result = await this.stashService.findPerformer(id).result();
    this.loading = result.loading;

    this.name = result.data.findPerformer.name;
    this.favorite = result.data.findPerformer.favorite;
    this.aliases = result.data.findPerformer.aliases;
    this.country = result.data.findPerformer.country;
    this.birthdate = result.data.findPerformer.birthdate;
    this.ethnicity = result.data.findPerformer.ethnicity;
    this.eye_color = result.data.findPerformer.eye_color;
    this.height = result.data.findPerformer.height;
    this.measurements = result.data.findPerformer.measurements;
    this.fake_tits = result.data.findPerformer.fake_tits;
    this.career_length = result.data.findPerformer.career_length;
    this.tattoos = result.data.findPerformer.tattoos;
    this.piercings = result.data.findPerformer.piercings;
    this.url = result.data.findPerformer.url;
    this.twitter = result.data.findPerformer.twitter;
    this.instagram = result.data.findPerformer.instagram;

    this.image_path = result.data.findPerformer.image_path;
    this.imagePreview = this.image_path;
  }

  onImageChange(event) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onloadend = (e) => {
      this.image = reader.result;
      this.imagePreview = this.image;
    }
    reader.readAsDataURL(file);
  }

  onResetImage(imageInput) {
    imageInput.value = ''
    this.imagePreview = this.image_path;
    this.image = null;
  }

  onFavoriteChange() {
    this.favorite = !this.favorite;
  }

  onSubmit() {
    const id = this.route.snapshot.params['id'];

    if (!!id) {
      this.stashService.performerUpdate({
        id: id,
        name: this.name,
        url: this.url,
        birthdate: this.birthdate,
        ethnicity: this.ethnicity,
        country: this.country,
        eye_color: this.eye_color,
        height: this.height,
        measurements: this.measurements,
        fake_tits: this.fake_tits,
        career_length: this.career_length,
        tattoos: this.tattoos,
        piercings: this.piercings,
        aliases: this.aliases,
        twitter: this.twitter,
        instagram: this.instagram,
        favorite: this.favorite,
        image: this.image
      }).subscribe(result => {
        this.router.navigate(['/performers', id]);
      });
    } else {
      this.stashService.performerCreate({
        name: this.name,
        url: this.url,
        birthdate: this.birthdate,
        ethnicity: this.ethnicity,
        country: this.country,
        eye_color: this.eye_color,
        height: this.height,
        measurements: this.measurements,
        fake_tits: this.fake_tits,
        career_length: this.career_length,
        tattoos: this.tattoos,
        piercings: this.piercings,
        aliases: this.aliases,
        twitter: this.twitter,
        instagram: this.instagram,
        favorite: this.favorite,
        image: this.image
      }).subscribe(result => {
        this.router.navigate(['/performers', result.data.performerCreate.performer.id]);
      });
    }
  }

  onScrape() {
    console.log('scrape', this.url);

    this.artooService.scrapeFreeones(this.url).then(response => {
      this.name = response.name;
      this.aliases = response.aliases;
      this.country = response.country;
      this.birthdate = response.birthdate;
      this.ethnicity = response.ethnicity;
      this.eye_color = response.eye_color;
      this.height = response.height;
      this.measurements = response.measurements;
      this.fake_tits = response.fake_tits;
      this.career_length = response.career_length;
      this.tattoos = response.tattoos;
      this.piercings = response.piercings;
      this.twitter = response.twitter;
      this.instagram = response.instagram;
    });
  }

}
