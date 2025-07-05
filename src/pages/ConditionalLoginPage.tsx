import { isIOS } from "../utils/os";
import LoginPage from "./LoginPage";
import LoginPageEmailPW from "./LoginPageEmailPW";

const ConditionalLoginPage: React.FC = () => {

    // Check if the current OS is iOS
    const isIos = isIOS();
    if (isIos) {
        // If iOS, redirect to the email/password login page
        return <LoginPageEmailPW />; // This should be your email/password login component
    }

    return <LoginPage />
}

export default ConditionalLoginPage;