export const en = {
    notFound: {
        message: "Sorry, the information you are looking for does not exist or has been deleted."
    },
    auth: {
        login: "Log in",
        logout: "Logout",
        register: "Register",
        noAccountYet: "No account yet?",
        alreadyHaveAnAccount: "Already have an account?",
        loginPlaceholder: "Login",
        passwordPlaceholder: "Password",
        confirmPasswordPlaceholder: "Confirm Password",
        passwordsNotMatch: "Passwords do not match"
    },
    notes: {
        create: "Create",
        titlePlaceholder: "Enter the note title",
        contentPlaceholder: "Enter your text...",
        numberOfNotes: "Notes",
        views: "Views",
        noNotes: "There are no notes yet",
        createNew: "Create new",
        edit: "Edit",
        share: "Share",
        delete: "Delete"
    },
    modals: {
        confirm: "Continue",
        cancel: "Cancel"
    },
    expiration: {
        typeOfDelete: "Type of delete",
        never: "Never",
        burnAfterRead: "Burn after read",
        burnByPeriod: "Burn by period"
    },
    header: {
        logoutConfirm: "Are you sure you want to log out?",
        openMenu: "Open menu"
    },
    api: {
        errors: {
            unauthorizedAccess: "Unauthorized access. Please log in.",
            noteNotFound: "Note not found.",
            serverError: "Server error: {status}",
            connectionError: "Connection error with server",
            insufficientPermissions: "Insufficient permissions to delete note",
            deleteNoteError: "Error deleting note",
            invalidData: "Invalid data",
            specifyTime: "Specify time for Burn by period",
            invalidTitle: "Invalid characters in title. Only English letters and numbers allowed.",
            insufficientEditPermissions: "Insufficient permissions for editing",
            saveChangesError: "Error saving changes",
            loadNotesError: "Error loading notes: {status}",
            loginError: "Login error: check username and password",
            userExists: "User already exists",
            registrationError: "Registration error",
            logoutError: "Logout error",
            refreshUnable: "Can not refresh token",
            unavailableNote: "Sorry, note is not available"
        }
    },
    ui: {
        clipboard: {
            copied: "Link copied to clipboard!",
            copyFailed: "Failed to copy link",
        },
        auth: {
            required: "Authorization required"
        },
        note: {
            deleteFailed: "Failed to delete note",
            deleteError: "An error occurred while deleting"
        }
    },
    editNote: {
        specifyDateTime: "Please specify date and time for deletion.",
        changesSaved: "Changes saved successfully",
        deleteDateTime: "Delete date and time",
        willBeDeleted: "Note will be deleted:",
        save: "Save"
    },
    user: {
        loading: "Loading...",
        previous: "Previous",
        next: "Next",
        page: "Page",
        of: "of",
        createNewNote: "Create a new one"
    }
};
