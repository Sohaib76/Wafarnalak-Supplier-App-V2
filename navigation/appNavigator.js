import AccountCreationComponent from "../components/home/accountCreationComponent";
import AddressesComponent from "../components/address/addresses";
import AllNewOrderComponent from "../components/order/allNewOrderComponent";
import AllOngoingOrderComponent from "../components/order/allOngoingOrdersComponent";
import BalanceComponent from "../components/balance/balanceComponent";
import BusinessCategoryComponent from "../components/registration-steps/businessCategoryComponent";
import CategoriesServiceComponent from "../components/registration-steps/categoriesServiceComponent";
import ComessionCalculatorComponent from "../components/balance/comessionsCalculator";
import CompanyProfileComponent from "../components/registration-steps/companyProfileComponent";
import DisabledAccountComponent from "../components/profile/disabledAccount";
import DisplayDocumentsComponent from "../components/documts/displayDoucment";
import GoogleMapComponent from "../components/address/googleMapComponent";
import GoogleMapsView from "../components/map/mapview";
import HomeComponent from "../components/home/homeComponent";
import InvoiceTableComponent from "../components/balance/table";
import LoginComponent from "../components/authentication/loginComponent";
import MyProfileComponent from "../components/profile/myProfileComponent";
import NewOrderComponent from "../components/order/newOrderComponent";
import OngoingOrderComponent from "../components/order/ongoingOrderComponent";
import OrderDeliveredComponent from "../components/order/orderDeliveredComponent";
import ProfileVerificationComponent from "../components/profile/profileVerificationComponent";
import SelectLocationComponent from "../components/address/selectLocation";
import SignupComponent from "../components/registration-steps/signupComonent";
import UpdateProfileComponent from "../components/profile/updateProfileComponent";
import UploadDocumentComponent from "../components/documts/uploadDocumentComponent";
import ViewDocumentsComponent from "../components/documts/viewDocuments";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { GetPrice } from "../components/balance/GetPrice";

const profileNavigator = createStackNavigator(
  {
    Login: { screen: LoginComponent },
    AccountCreation: { screen: AccountCreationComponent },
    Home: { screen: HomeComponent },
    BusinessCategory: { screen: BusinessCategoryComponent },
    CompanyProfile: { screen: CompanyProfileComponent },
    Signup: { screen: SignupComponent },
    CategoriesService: { screen: CategoriesServiceComponent },
    GoogleMap: { screen: GoogleMapComponent },
    UploadDocument: { screen: UploadDocumentComponent },
    Addresses: { screen: AddressesComponent },
    OngoingOrder: { screen: OngoingOrderComponent },
    NewOrder: { screen: NewOrderComponent },
    MyProfile: { screen: MyProfileComponent },
    Balance: { screen: BalanceComponent },
    OrderDelivered: { screen: OrderDeliveredComponent },
    ProfileVerification: { screen: ProfileVerificationComponent },
    InvoiceTable: { screen: InvoiceTableComponent },
    ViewDocuments: { screen: ViewDocumentsComponent },
    DisabledAccount: { screen: DisabledAccountComponent },
    UpdateProfile: { screen: UpdateProfileComponent },
    SelectLocation: { screen: SelectLocationComponent },
    DisplayDocuments: { screen: DisplayDocumentsComponent },
    GoogleMapsView: { screen: GoogleMapsView },
    AllNewOrder: { screen: AllNewOrderComponent },
    AllOngoingOrder: { screen: AllOngoingOrderComponent },
    ComessionCalculator: { screen: ComessionCalculatorComponent },
    GetPrice: { screen: GetPrice },
  },
  {
    initialRouteName: "Login",
    headerMode: "none",
  }
);

const AppNavigator = createAppContainer(profileNavigator, {
  headerMode: "none",
});

export default AppNavigator;
