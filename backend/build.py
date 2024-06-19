import os
import shutil
import zipfile

def copy_files(src, dest, ignore_list):
    """
    Recursively copies files from source directory to destination directory,
    excluding files and directories listed in the ignore_list.
    """
    for item in os.listdir(src):
        if item not in ignore_list:
            #Create File Paths
            s = os.path.join(src, item)
            d = os.path.join(dest, item)
            #Handling Directories Seperately
            if os.path.isdir(s):
                shutil.copytree(s, d, ignore=shutil.ignore_patterns(*ignore_list))
            else:
                shutil.copy2(s, d)

def zip_folder(folder_path, zip_name):
    """
    Creates a zip file of the specified folder.
    """
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, os.path.relpath(file_path, folder_path))

def load_gitignore(ignore_file):
    """
    Loads patterns from .gitignore file and returns a list.
    """
    ignore_list = []
    if os.path.exists(ignore_file):
        with open(ignore_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):  # Ignore empty lines and comments
                    ignore_list.append(line)
    return ignore_list

def create_env_file(folder_path):
    """
    Creates a .env file in the specified folder with the content AWS=TRUE.
    """
    env_content = "AWS=TRUE"
    env_file_path = os.path.join(folder_path, '.env')
    with open(env_file_path, 'w') as env_file:
        env_file.write(env_content)

def main():
    # Define the source folder for file operations(current directory)
    src_folder = os.getcwd()

    # Define destination folder (staging directory)
    dest_folder = os.path.join(src_folder, 'staging')

    # Define zip file name
    zip_name = 'projectPilot.zip'

    # Load .buildIgnore file and create an ignore_list
    gitignore_file = os.path.join(src_folder, '.buildIgnore')
    print ("Loading .buildIgnore: ", end="")
    ignore_list = load_gitignore(gitignore_file)
    print("Done")
    # Add additional files and directories to ignore
    ignore_list.extend(['.git', '__pycache__', 'staging', zip_name])  # Add any other files/folders to ignore

    # Create staging folder and copy files
    if not os.path.exists(dest_folder):
        os.makedirs(dest_folder)
    print("Staging Files: ",end="")
    copy_files(src_folder, dest_folder, ignore_list)
    print("Done")

    # Setup .env for using aws environment variables
    print("Configuring Application: ",end="")
    create_env_file(dest_folder)
    print("Done")

    # Pause to allow changes to staging folder
    input("Make any required changes to the staging folder and press enter to continue")

    # Zip the staging folder
    print("Compressing to Zip: ",end="")
    zip_folder(dest_folder, zip_name)
    print("Done")

    # Clean up the staging folder
    print("Cleaning up build files: ",end="")
    shutil.rmtree(dest_folder)
    print("Done")

    print("Build Complete")
if __name__ == "__main__":
    main()
