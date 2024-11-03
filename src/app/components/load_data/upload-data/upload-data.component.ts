import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileExcel, faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TablePreview, ExcelService } from '../../../services/excel.service';
import { TableComponent } from '../../table/table.component';
import { NotificationService } from '../../../services/notification.service';
import { LoadDataService } from '../load-data.service';
import { SearchValues } from '../../generic/search.service';
import { NavigationService } from '../../../services/navigation.service';
import { map, of, switchMap } from 'rxjs';

/**
 * Component for handling data upload functionality through Excel files.
 * @template T - Type extending SearchValues interface for the data structure
 *
 * @description
 * This component provides functionality to:
 * - Upload and parse Excel files
 * - Display data in a table preview format
 * - Save the uploaded data to a database
 *
 * @input title - Required string for the component's title
 * @input name - Required string for identifying the type of data being handled
 * @input valid_headers - Required array of strings representing valid Excel column headers
 * @input load_data_service - Required service instance for handling data loading operations
 *
 * @output data - Emits string array of processed data
 *
 * @example
 * ```html
 * <app-upload-data
 *   [title]="'Upload Contacts'"
 *   [name]="'contacts'"
 *   [valid_headers]="['name', 'email', 'phone']"
 *   [load_data_service]="contactLoadService">
 * </app-upload-data>
 * ```
 */
@Component({
  selector: 'app-upload-data',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    TableComponent,
  ],
  templateUrl: './upload-data.component.html',
  styleUrl: './upload-data.component.css',
})
export class UploadDataComponent<T extends SearchValues> {
  /**
   * Constructs an instance of UploadDataComponent.
   *
   * @param excel_service - Service for handling Excel operations.
   * @param noti_service - Service for displaying notifications.
   * @param navigation_service - Service for handling navigation.
   *
   * Initializes the component by loading data from the database and transforming it for preview.
   */
  constructor(
    public excel_service: ExcelService,
    private noti_service: NotificationService,
    private navigation_service: NavigationService
  ) {
    effect(() => this.load_data_from_db());
  }

  load_data_from_db() {
    this.load_data_service()
      .db.read_all()
      .subscribe((res) => {
        const data = res.rows.map((row) => row.doc as T);
        this.all_data = new TablePreview();
        this.all_data.transform_generic_data(data, this.valid_headers());
        this.is_preview_for_new_data = false;
      });
  }

  is_preview_for_new_data = false;

  /**
   * Stores the preview data for all tables in the application
   * @property {TablePreview | undefined} all_data - The preview data for all tables, undefined if no data is loaded
   */
  public all_data: TablePreview | undefined = undefined;

  /**
   * Icon representing an Excel file.
   * Uses Font Awesome's Excel file icon from the free icon set.
   * @type {IconDefinition}
   */
  public excel = faFileExcel;

  /**
   * FontAwesome icon representing a floppy disk, used for save actions.
   * Imported from the 'faFloppyDisk' icon from '@fortawesome/free-solid-svg-icons'.
   */
  public save = faFloppyDisk;

  /**
   * The title of the upload data section.
   * @required This field is required and must be a string value.
   */
  title = input.required<string>();

  /**
   * Required input string property representing the name.
   * @required
   * @type {string}
   */
  name = input.required<string>();

  /**
   * An array containing the required headers for data validation.
   * This property specifies the mandatory column headers that must be present
   * in the uploaded data for proper processing.
   * @type {string[]}
   */
  valid_headers = input.required<string[]>();

  /**
   * Service instance for handling data loading operations.
   * Required input signal that provides functionality for loading and managing data of type T.
   * @required This is a mandatory input that must be provided for the component to function.
   */
  load_data_service = input.required<LoadDataService<T>>();

  /**
   * Event emitter that outputs an array of strings when data is processed.
   * Uses Angular's output decorator for component communication.
   */
  data = output<string[]>();

  /**
   * Loads and processes file data using the Excel service
   * @param files - The FileList object containing the files to be loaded, can be null
   * @returns Promise<void> - Asynchronously loads the file data and assigns it to all_data
   */
  async load_file(files: FileList | null) {
    const data = await this.excel_service.load_data(
      files,
      this.valid_headers()
    );
    this.all_data = data;
    this.is_preview_for_new_data = true;
  }

  @ViewChild('input_file')
  input_file: ElementRef | undefined;

  /**
   * Saves new data entries after user confirmation.
   * Processes the loaded data and stores it in bulk to the database.
   *
   * The method performs the following steps:
   * 1. Requests user confirmation
   * 2. Validates that data exists
   * 3. Transforms data entries ensuring ID is string
   * 4. Performs bulk save operation
   * 5. Shows success notification
   * 6. Navigates to configured route
   *
   * @throws {void} Does not throw errors but shows notifications for invalid states
   * @returns {void}
   */
  save_news(): void {
    this.noti_service
      .confirmation(`¿Desea guardar los nuevos ${this.name()}?`)
      .subscribe((res) => {
        if (res.isConfirmed) {
          let data = this.all_data?.data_object;
          if (!data) {
            this.noti_service.info('No hay datos cargados', '');
            return;
          }

          // Transform data to ensure _id is a string
          data = data.map((d) => {
            return { ...d, _id: d._id.toString() };
          });

          this.load_data_service()
            .db.read_all()
            .pipe(
              map((res) => {
                const results = res.rows;
                const data_ready = [];
                for (const d of data ?? []) {
                  const record = results.find((r) => r.doc?._id === d._id);
                  if (!record) continue;
                  // The record exist, so the data needs _rev field to update
                  const _rev = record.doc?._rev;
                  data_ready.push({ ...d, _rev });
                }
                return data_ready;
              }),
              switchMap((data_ready) =>
                this.load_data_service().db.bulk(data_ready)
              )
            )
            .subscribe(() => {
              this.noti_service.success(`${this.name()} guardados`, '');
              this.load_data_from_db();
              if (this.input_file?.nativeElement) {
                alert(
                  'Se ha cargado el archivo' +
                    this.input_file.nativeElement.getAttribute('id')
                );
                this.input_file.nativeElement.value = '';
              }

              const route = this.load_data_service().navigate_after_load;
              this.navigation_service.go_to(route, {
                onSameUrlNavigation: 'reload',
              });
            });
        }
        if (res.isDenied) this.noti_service.info('Operación cancelada', '');
      });
  }
}

/**
 * Abstract component class that defines the contract for
 * uploading data components.
 * Implementations of this class should handle data upload
 * functionality with specific data types.
 *
 * @template T - Type parameter that extends SearchValues
 * interface, represents the data structure being uploaded
 *
 * @abstract
 * @class
 *
 * @property {string[]} valid_headers - Abstract property that
 * should contain the list of valid headers for the data being
 * uploaded
 * @property {LoadDataService<T>} load_data_service - Abstract
 * property that should contain the service handling the data
 * loading operations
 */
@Component({
  selector: 'app-upload-data',
  standalone: true,
  imports: [],
  template: '',
})
export abstract class UploadDataToImplement<T extends SearchValues> {
  /**
   * List of valid headers required for data validation.
   * This abstract property must be implemented by child classes to define
   * the expected column headers for their specific data format.
   * @abstract
   */
  abstract valid_headers: string[];
  /**
   * Abstract service property for handling data loading operations.
   * Requires a concrete implementation of LoadDataService with generic type T.
   * @abstract
   * @type {LoadDataService<T>}
   */
  abstract load_data_service: LoadDataService<T>;
}
